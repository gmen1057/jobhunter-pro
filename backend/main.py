from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from loguru import logger
import httpx

load_dotenv()

app = FastAPI(
    title="JobHunter Pro API",
    description="Автоматизированная система поиска работы",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://jhunterpro.ru", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Models
class User(BaseModel):
    id: int
    email: str
    name: str
    hh_token: Optional[str] = None

class VacancyFilter(BaseModel):
    text: Optional[str] = None
    area: Optional[int] = None
    salary_from: Optional[int] = None
    salary_to: Optional[int] = None
    experience: Optional[str] = None
    employment: Optional[str] = None

class Vacancy(BaseModel):
    id: str
    name: str
    employer_name: str
    salary_from: Optional[int]
    salary_to: Optional[int]
    currency: Optional[str]
    area_name: str
    published_at: str
    url: str

# Routes
@app.get("/")
async def root():
    return {"message": "JobHunter Pro API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/auth/hh")
async def hh_auth():
    """Инициализация OAuth авторизации с HeadHunter"""
    client_id = os.getenv("HH_CLIENT_ID")
    # Redirect URI должен точно совпадать с указанным в настройках приложения на hh.ru
    # Если в настройках указан https://localhost:8080/auth/callback, используйте его
    # Иначе обновите настройки приложения на hh.ru
    redirect_uri = os.getenv("HH_REDIRECT_URI", "https://jhunterpro.ru/api/auth/callback")
    auth_url = f"https://hh.ru/oauth/authorize?response_type=code&client_id={client_id}&redirect_uri={redirect_uri}"
    return {"auth_url": auth_url}

@app.get("/auth/callback")
async def auth_callback(request: Request, code: str = None):
    """Callback для получения токена от HeadHunter"""
    from services.hh_client import HHClient
    
    logger.info(f"Auth callback received. URL: {request.url}")
    logger.info(f"Query params: {request.query_params}")
    
    if not code:
        logger.error("No code parameter received")
        error_url = "https://62.109.16.204/?error=no_code"
        from fastapi.responses import RedirectResponse
        return RedirectResponse(url=error_url)
    
    logger.info(f"Auth callback received with code: {code[:10]}...")
    
    try:
        hh_client = HHClient()
        redirect_uri = os.getenv("HH_REDIRECT_URI", "https://jhunterpro.ru/api/auth/callback")
        logger.info(f"Using redirect_uri: {redirect_uri}")
        
        # Обмениваем код на токен
        logger.info("Exchanging code for token...")
        token_data = await hh_client.get_access_token(code, redirect_uri)
        logger.info(f"Token received successfully: {token_data.get('token_type', 'unknown')} token")
        
        # В реальном приложении здесь нужно:
        # 1. Сохранить токен в БД с привязкой к пользователю
        # 2. Создать JWT токен для нашего приложения
        # 3. Перенаправить на фронтенд с токеном
        
        # Временное решение - перенаправляем с токеном в URL
        frontend_url = f"https://jhunterpro.ru/?auth_token={token_data['access_token']}"
        logger.info(f"Redirecting to frontend: {frontend_url[:50]}...")
        from fastapi.responses import RedirectResponse
        return RedirectResponse(url=frontend_url)
        
    except Exception as e:
        logger.error(f"Auth callback error: {e}")
        logger.error(f"Error type: {type(e).__name__}")
        error_url = "https://jhunterpro.ru/?error=auth_failed"
        from fastapi.responses import RedirectResponse
        return RedirectResponse(url=error_url)

@app.get("/vacancies/search")
async def search_vacancies(
    text: Optional[str] = None,
    area: Optional[int] = None,
    salary_from: Optional[int] = None,
    page: int = 0
):
    """Поиск вакансий через HeadHunter API"""
    # TODO: Реализовать поиск через HH API
    mock_vacancies = [
        {
            "id": "123456",
            "name": "Python Developer",
            "employer_name": "TechCorp",
            "salary_from": 150000,
            "salary_to": 250000,
            "currency": "RUR",
            "area_name": "Москва",
            "published_at": "2024-01-15T10:00:00",
            "url": "https://hh.ru/vacancy/123456"
        }
    ]
    return {"items": mock_vacancies, "found": 1, "page": page}

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
        
        # Формируем полное имя
        first_name = user_data.get("first_name", "")
        last_name = user_data.get("last_name", "") 
        middle_name = user_data.get("middle_name", "")
        
        full_name = f"{last_name} {first_name}".strip()
        if middle_name:
            full_name = f"{last_name} {first_name} {middle_name}".strip()
        
        return {
            "id": user_data.get("id"),
            "email": user_data.get("email"),
            "name": f"{first_name} {last_name}".strip(),
            "full_name": full_name,
            "first_name": first_name,
            "last_name": last_name,
            "middle_name": middle_name,
            "hh_id": user_data.get("id"),
            "hh_token": "token_exists"
        }
    except Exception as e:
        logger.error(f"Error getting user profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
# Резюме endpoints
@app.get("/resumes/mine")
async def get_my_resumes(request: Request):
    """Получить список резюме пользователя"""
    token = request.headers.get("authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        from services.hh_client import HHClient
        hh_client = HHClient(access_token=token)
        resumes = await hh_client.get_resumes()
        return {"items": resumes, "found": len(resumes)}
    except Exception as e:
        logger.error(f"Error getting resumes: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/resumes/{resume_id}")
async def get_resume_details(resume_id: str, request: Request):
    """Получить детали конкретного резюме"""
    token = request.headers.get("authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        from services.hh_client import HHClient
        hh_client = HHClient(access_token=token)
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.hh.ru/resumes/{resume_id}",
                headers=hh_client._get_headers()
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        logger.error(f"Error getting resume details: {e}")
        raise HTTPException(status_code=500, detail=str(e))

