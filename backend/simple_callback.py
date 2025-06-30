@app.get("/auth/callback")
async def auth_callback(
    request: Request, 
    code: str = None,
    error: str = None,
    error_description: str = None,
    db: Session = Depends(get_db)
):
    """Простой callback для получения токена от HeadHunter"""
    from services.hh_client import HHClient
    from fastapi.responses import RedirectResponse
    
    logger.info(f"Auth callback received. URL: {request.url}")
    
    # Обработка ошибок авторизации от HH
    if error:
        logger.error(f"OAuth error from HH: {error} - {error_description}")
        return RedirectResponse(url=f"https://jhunterpro.ru/?error={error}&message={error_description or 'OAuth error'}")
    
    if not code:
        logger.error("No code parameter received")
        return RedirectResponse(url="https://jhunterpro.ru/?error=no_code&message=Authorization cancelled")
    
    try:
        hh_client = HHClient()
        redirect_uri = os.getenv("HH_REDIRECT_URI", "https://jhunterpro.ru/api/auth/callback")
        
        # Обмениваем код на токен
        token_data = await hh_client.get_access_token(code, redirect_uri)
        logger.info("Token received successfully")
        
        # Получаем данные пользователя
        user_data = await hh_client.get_me(token_data['access_token'])
        logger.info(f"User data received: {user_data.get('email', 'no email')}")
        
        # Get or Create пользователя в БД
        user = db.query(User).filter(User.hh_user_id == str(user_data['id'])).first()
        
        if user:
            logger.info(f"Found existing user: {user.id}")
            login_status = "logged_in"
        else:
            logger.info(f"Creating new user for HH user: {user_data['id']}")
            user = User(
                hh_user_id=str(user_data['id']),
                email=user_data.get('email'),
                first_name=user_data.get('first_name'),
                last_name=user_data.get('last_name'),
                middle_name=user_data.get('middle_name')
            )
            db.add(user)
            login_status = "created"
        
        db.commit()
        db.refresh(user)
        logger.info(f"User saved with public_id: {user.public_id}")
        
        # Сохраняем токены через TokenService
        from services.token_service import TokenService
        token_service = TokenService(db)
        await token_service.save_initial_tokens(
            user_id=user.id,
            access_token=token_data['access_token'],
            refresh_token=token_data['refresh_token'],
            expires_in=token_data.get('expires_in', 86400)
        )
        logger.info(f"Tokens saved for user {user.id}")
        
        # Перенаправляем на фронтенд с public_id
        frontend_url = f"https://jhunterpro.ru/?user_id={user.public_id}&status={login_status}"
        logger.info(f"Redirecting to frontend with user_id: {user.public_id}")
        return RedirectResponse(url=frontend_url)
        
    except Exception as e:
        logger.error(f"Auth callback error: {e}", exc_info=True)
        return RedirectResponse(url="https://jhunterpro.ru/?error=auth_failed&message=Authorization failed")
