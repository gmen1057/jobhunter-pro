@app.get("/auth/callback")
async def auth_callback(
    request: Request, 
    code: str = None,
    db: Session = Depends(get_db)
):
    """Callback для получения токена от HeadHunter"""
    from services.hh_client import HHClient
    from services.token_service import TokenService
    
    logger.info(f"Auth callback received. URL: {request.url}")
    logger.info(f"Query params: {request.query_params}")
    
    # Обработка ошибок авторизации
    if not code:
        logger.error("No code parameter received")
        return RedirectResponse(url="https://jhunterpro.ru/?error=no_code&message=Authorization+cancelled")
    
    # Проверяем специальные параметры ошибок от HH
    error = request.query_params.get("error")
    if error:
        error_desc = request.query_params.get("error_description", "Unknown error")
        logger.error(f"HH OAuth error: {error} - {error_desc}")
        return RedirectResponse(url=f"https://jhunterpro.ru/?error={error}&message={error_desc}")
    
    logger.info(f"Auth callback received with code: {code[:10]}...")
    
    try:
        hh_client = HHClient()
        redirect_uri = os.getenv("HH_REDIRECT_URI", "https://jhunterpro.ru/api/auth/callback")
        logger.info(f"Using redirect_uri: {redirect_uri}")
        
        # Step 1: Обмениваем код на токен
        logger.info("Exchanging code for token...")
        token_data = await hh_client.get_access_token(code, redirect_uri)
        logger.info(f"Token received successfully")
        
        # Step 2: Получаем информацию о пользователе
        logger.info("Getting user info from HH...")
        user_info = await hh_client.get_me(token_data['access_token'])
        hh_user_id = user_info['id']
        logger.info(f"Got user info for HH user: {hh_user_id}")
        
        # Step 3: Get or Create пользователя в БД
        user = db.query(User).filter(User.hh_user_id == hh_user_id).first()
        
        if user:
            logger.info(f"Found existing user: {user.id}")
            # Обновляем информацию пользователя
            user.email = user_info.get('email', user.email)
            user.first_name = user_info.get('first_name', user.first_name)
            user.last_name = user_info.get('last_name', user.last_name)
            user.middle_name = user_info.get('middle_name', user.middle_name)
            login_status = "logged_in"
        else:
            logger.info(f"Creating new user for HH user: {hh_user_id}")
            # Создаем нового пользователя
            user = User(
                hh_user_id=hh_user_id,
                email=user_info.get('email'),
                first_name=user_info.get('first_name'),
                last_name=user_info.get('last_name'),
                middle_name=user_info.get('middle_name')
            )
            db.add(user)
            login_status = "created"
        
        db.commit()
        logger.info(f"User saved/updated with public_id: {user.public_id}")
        
        # Step 4: Сохраняем токены через TokenService
        token_service = TokenService(db)
        await token_service.save_initial_tokens(
            user_id=user.id,
            access_token=token_data['access_token'],
            refresh_token=token_data['refresh_token'],
            expires_in=token_data.get('expires_in', 86400)
        )
        logger.info(f"Tokens saved for user {user.id}")
        
        # Step 5: Сохраняем professional roles из резюме
        try:
            resumes = await hh_client.get_resumes(token_data['access_token'])
            await _save_professional_roles(db, user.id, resumes)
        except Exception as e:
            logger.warning(f"Failed to save professional roles: {e}")
            # Не прерываем процесс авторизации из-за этой ошибки
        
        # Step 6: Перенаправляем на фронтенд с public_id
        frontend_url = f"https://jhunterpro.ru/?user_id={user.public_id}&status={login_status}"
        logger.info(f"Redirecting to frontend with public_id")
        return RedirectResponse(url=frontend_url)
        
    except Exception as e:
        logger.error(f"Error in auth callback: {e}", exc_info=True)
        error_type = "auth_failed" if "401" in str(e) else "server_error"
        return RedirectResponse(url=f"https://jhunterpro.ru/?error={error_type}&message=Authorization+failed")
