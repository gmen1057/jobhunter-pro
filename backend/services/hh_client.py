import httpx
import os
from typing import Optional, Dict, List, Any
from pydantic import BaseModel
from loguru import logger

class HHClient:
    """Клиент для работы с HeadHunter API"""
    
    BASE_URL = "https://api.hh.ru"
    
    def __init__(self, access_token: Optional[str] = None):
        self.access_token = access_token
        self.client_id = os.getenv("HH_CLIENT_ID")
        self.client_secret = os.getenv("HH_CLIENT_SECRET")
        
    def _get_headers(self) -> Dict[str, str]:
        """Получить заголовки для запросов"""
        headers = {
            "User-Agent": "JobHunter Pro (a.sokolov@techinnovate.ru)",
            "Content-Type": "application/json"
        }
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        return headers
    
    async def get_access_token(self, code: str, redirect_uri: str) -> Dict[str, Any]:
        """Обменять authorization code на access token"""
        data = {
            "grant_type": "authorization_code",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": code,
            "redirect_uri": redirect_uri
        }
        
        logger.info(f"Token request data: {data}")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/token",
                data=data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            logger.info(f"Token response status: {response.status_code}")
            logger.info(f"Token response text: {response.text}")
            
            if response.status_code != 200:
                logger.error(f"Token exchange failed: {response.status_code} - {response.text}")
                raise Exception(f"Token exchange failed: {response.status_code} - {response.text}")
                
            return response.json()
    
    async def search_vacancies(
        self,
        text: Optional[str] = None,
        area: Optional[int] = None,
        salary: Optional[int] = None,
        experience: Optional[str] = None,
        employment: Optional[str] = None,
        page: int = 0,
        per_page: int = 20,
        professional_roles: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Поиск вакансий"""
        params = {
            "page": page,
            "per_page": per_page
        }
        
        if text:
            params["text"] = text
        if area:
            params["area"] = area
        if salary:
            params["salary"] = salary
        if experience:
            params["experience"] = experience
        if employment:
            params["employment"] = employment
        if professional_roles:
            params["professional_role"] = professional_roles
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/vacancies",
                params=params,
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def get_vacancy(self, vacancy_id: str) -> Dict[str, Any]:
        """Получить детали вакансии"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/vacancies/{vacancy_id}",
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def get_me(self) -> Dict[str, Any]:
        """Получить информацию о текущем пользователе"""
        if not self.access_token:
            raise ValueError("Access token required")
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/me",
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def get_resumes(self) -> List[Dict[str, Any]]:
        """Получить список резюме пользователя"""
        if not self.access_token:
            raise ValueError("Access token required")
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/resumes/mine",
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()["items"]
    
    async def apply_to_vacancy(self, vacancy_id: str, resume_id: str, message: str = "") -> Dict[str, Any]:
        """Откликнуться на вакансию"""
        if not self.access_token:
            raise ValueError("Access token required")
            
        data = {
            "resume_id": resume_id,
            "vacancy_id": vacancy_id,
            "message": message
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/negotiations",
                json=data,
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def get_negotiations(self) -> List[Dict[str, Any]]:
        """Получить список переговоров (откликов)"""
        if not self.access_token:
            raise ValueError("Access token required")
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/negotiations",
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()["items"]
    
    async def get_salary_statistics(self, professional_role: Optional[int] = None, area: Optional[int] = None) -> Dict[str, Any]:
        """Получить статистику зарплат"""
        params = {}
        if professional_role:
            params["professional_role"] = professional_role
        if area:
            params["area"] = area
            
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/salary_statistics",
                params=params,
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def get_areas(self) -> List[Dict[str, Any]]:
        """Получить справочник регионов"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/areas",
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def get_professional_roles(self) -> List[Dict[str, Any]]:
        """Получить справочник профессиональных ролей"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/professional_roles",
                headers=self._get_headers()
            )
            response.raise_for_status()
            return response.json()