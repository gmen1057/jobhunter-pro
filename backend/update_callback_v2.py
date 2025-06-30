import re

with open("main.py", "r") as f:
    content = f.read()

# Находим секцию, которую нужно заменить
old_section = """        # Проверяем существующего пользователя или создаем нового
        user = db.query(User).filter(User.hh_user_id == user_info['id']).first()
        
        if not user:
            # Создаем нового пользователя
            logger.info(f"Creating new user for HH ID: {user_info['id']}")
            user = User(
                public_id=str(uuid.uuid4()),
                hh_user_id=user_info['id'],
                email=user_info['email'],
                first_name=user_info.get('first_name'),
                last_name=user_info.get('last_name'),
                middle_name=user_info.get('middle_name'),
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"New user created with public_id: {user.public_id}")
        else:
            # Обновляем информацию существующего пользователя
            logger.info(f"Updating existing user with public_id: {user.public_id}")
            user.email = user_info['email']
            user.first_name = user_info.get('first_name')
            user.last_name = user_info.get('last_name')
            user.middle_name = user_info.get('middle_name')
            user.updated_at = datetime.now(timezone.utc)
            db.commit()
        
        # Сохраняем токены через TokenService
        logger.info("Saving tokens to database...")
        token_service = TokenService(db)
        await token_service.save_initial_tokens(
            user_id=user.id,
            access_token=token_data['access_token'],
            refresh_token=token_data['refresh_token'],
            expires_in=token_data['expires_in']
        )
        logger.info("Tokens saved successfully")"""

new_section = """        # Сохраняем пользователя и токены через TokenService
        logger.info("Saving user and tokens to database...")
        token_service = TokenService(db)
        
        # Подготавливаем данные пользователя для TokenService
        user_data = {
            'hh_user_id': user_info['id'],
            'email': user_info['email'],
            'first_name': user_info.get('first_name'),
            'last_name': user_info.get('last_name'),
            'middle_name': user_info.get('middle_name'),
            'phone': user_info.get('phone')
        }
        
        # Подготавливаем данные токена
        token_data_for_service = {
            'access_token': token_data['access_token'],
            'refresh_token': token_data['refresh_token'],
            'expires_in': token_data['expires_in']
        }
        
        # Сохраняем через TokenService
        await token_service.save_initial_tokens(user_data, token_data_for_service)
        logger.info("User and tokens saved successfully")
        
        # Получаем обновленного пользователя для получения его public_id
        user = db.query(User).filter(User.hh_user_id == user_info['id']).first()
        if not user:
            logger.error("User not found after save_initial_tokens")
            raise Exception("User creation failed")"""

# Заменяем
new_content = content.replace(old_section, new_section)

if new_content \!= content:
    with open("main.py", "w") as f:
        f.write(new_content)
    print("Callback updated successfully")
else:
    print("Pattern not found, no changes made")
