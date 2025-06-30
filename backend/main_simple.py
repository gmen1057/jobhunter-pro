from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from loguru import logger
import httpx
from fastapi.responses import RedirectResponse

load_dotenv()

app = FastAPI(
    title="JobHunter Pro API (Simple Version)",
    description="Автоматизированная система поиска работы БЕЗ БД",
    version="1.0.0"
)

# CORS настройки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

@app.get("/")
async def root():
    return {"message": "JobHunter Pro API - Simple Version (No DB)"}

@app.post("/auth/hh")
async def hh_auth():
    """Инициализация OAuth авторизации с HeadHunter"""
    client_id = os.getenv("HH_CLIENT_ID")
    redirect_uri = os.getenv("HH_REDIRECT_URI")
    if not redirect_uri:
        raise HTTPException(status_code=500, detail="HH_REDIRECT_URI not configured")
    
    auth_url = f"https://hh.ru/oauth/authorize?response_type=code&client_id={client_id}&redirect_uri={redirect_uri}"
    return {"auth_url": auth_url}

@app.get("/auth/callback")
async def auth_callback(code: str = None):
    """OAuth callback - простая версия без БД"""
    from services.hh_client import HHClient
    
    if not code:
        return RedirectResponse(url="https://jhunterpro.ru/?error=no_code")
    
    try:
        hh_client = HHClient()
        redirect_uri = os.getenv("HH_REDIRECT_URI")
        
        # Получаем токен от HH
        token_data = await hh_client.get_access_token(code, redirect_uri)
        
        # Просто возвращаем токен на frontend
        frontend_url = f"https://jhunterpro.ru/?access_token={token_data["access_token"]}&token_type=bearer"
        return RedirectResponse(url=frontend_url)
        
    except Exception as e:
        logger.error(f"Auth callback error: {e}")
        return RedirectResponse(url="https://jhunterpro.ru/?error=auth_failed")

@app.get("/user/profile")
async def get_user_profile(request: Request):
    """Получение профиля пользователя из HeadHunter API"""
    token = request.headers.get("authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        from services.hh_client import HHClient
        hh_client = HHClient(access_token=token)
        user_data = await hh_client.get_me()
        
        return {
            "email": user_data.get("email"),
            "name": f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip(),
            "phone": user_data.get("phone"),
            "id": user_data.get("id")
        }
    except Exception as e:
        logger.error(f"Error getting user profile: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/vacancies/search")
async def search_vacancies(
    text: Optional[str] = None,
    area: Optional[int] = None,
    salary: Optional[int] = None,
    experience: Optional[str] = None,
    employment: Optional[str] = None,
    page: int = 0,
    per_page: int = 20,
    request: Request = None
):
    """Поиск вакансий через HH API"""
    from services.hh_client import HHClient
    
    token = request.headers.get("authorization", "").replace("Bearer ", "") if request else None
    hh_client = HHClient(access_token=token)
    
    try:
        result = await hh_client.search_vacancies(
            text=text,
            area=area,
            salary=salary,
            experience=experience,
            employment=employment,
            page=page,
            per_page=per_page
        )
        return result
    except Exception as e:
        logger.error(f"Error searching vacancies: {e}")
        return {"items": [], "found": 0, "page": page}

@app.get("/resumes/mine")
async def get_my_resumes(request: Request):
    """Получение резюме пользователя"""
    token = request.headers.get("authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        from services.hh_client import HHClient
        hh_client = HHClient(access_token=token)
        resumes = await hh_client.get_resumes()
        return resumes
    except Exception as e:
        logger.error(f"Error getting resumes: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
