"""Token management service for HeadHunter OAuth."""

import os
import httpx
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional, Dict, Any

class TokenService:
    """Service for managing HH OAuth tokens with automatic refresh."""
    
    def __init__(self, db: Session):
        self.db = db
        self.client_id = os.getenv("HH_CLIENT_ID")
        self.client_secret = os.getenv("HH_CLIENT_SECRET")
        self.refresh_url = "https://hh.ru/oauth/token"
    
    async def get_valid_token(self, user_id: int) -> Optional[str]:
        """Get valid access token for user, refreshing if needed."""
        
        # Get user's current token from database
        result = self.db.execute(
            text("""
            SELECT ut.access_token, ut.refresh_token, ut.expires_at 
            FROM user_tokens ut 
            JOIN users u ON ut.user_id = u.id 
            WHERE u.id = :user_id 
            ORDER BY ut.created_at DESC 
            LIMIT 1
            """),
            {"user_id": user_id}
        ).fetchone()
        
        if not result:
            return None
            
        access_token, refresh_token, expires_at = result
        
        # Check if token is still valid (with 5-minute buffer)
        now = datetime.now()
        if expires_at and expires_at > now + timedelta(minutes=5):
            return access_token
            
        # Token expired, try to refresh
        new_token_data = await self._refresh_token(refresh_token)
        if new_token_data:
            # Update token in database
            await self._update_user_token(user_id, new_token_data)
            return new_token_data["access_token"]
            
        return None
    
    async def save_initial_tokens(self, user_data: Dict[str, Any], token_data: Dict[str, Any]) -> bool:
        """Save user and initial tokens to database."""
        try:
            # Insert or update user
            user_result = self.db.execute(
                text("""
                INSERT INTO users (hh_user_id, email, first_name, last_name, middle_name, phone)
                VALUES (:hh_user_id, :email, :first_name, :last_name, :middle_name, :phone)
                ON CONFLICT (hh_user_id) DO UPDATE SET
                    email = EXCLUDED.email,
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    middle_name = EXCLUDED.middle_name,
                    phone = EXCLUDED.phone,
                    updated_at = NOW()
                RETURNING id
                """),
                {
                    "hh_user_id": user_data["id"],
                    "email": user_data.get("email", ""),
                    "first_name": user_data.get("first_name", ""),
                    "last_name": user_data.get("last_name", ""),
                    "middle_name": user_data.get("middle_name", ""),
                    "phone": user_data.get("phone", "")
                }
            )
            
            user_id = user_result.fetchone()[0]
            
            # Save tokens
            expires_at = datetime.now() + timedelta(seconds=token_data.get("expires_in", 1200))
            
            self.db.execute(
                text("""
                INSERT INTO user_tokens (user_id, access_token, refresh_token, expires_at, token_type, scope)
                VALUES (:user_id, :access_token, :refresh_token, :expires_at, :token_type, :scope)
                """),
                {
                    "user_id": user_id,
                    "access_token": token_data["access_token"],
                    "refresh_token": token_data["refresh_token"],
                    "expires_at": expires_at,
                    "token_type": token_data.get("token_type", "Bearer"),
                    "scope": token_data.get("scope", "")
                }
            )
            
            self.db.commit()
            return user_id
            
        except Exception as e:
            self.db.rollback()
            print(f"Error saving tokens: {e}")
            return False
    
    async def _refresh_token(self, refresh_token: str) -> Optional[Dict[str, Any]]:
        """Refresh access token using refresh token."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.refresh_url,
                    data={
                        "grant_type": "refresh_token",
                        "refresh_token": refresh_token,
                        "client_id": self.client_id,
                        "client_secret": self.client_secret
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    print(f"Token refresh failed: {response.status_code} - {response.text}")
                    return None
                    
        except Exception as e:
            print(f"Error refreshing token: {e}")
            return None
    
    async def _update_user_token(self, user_id: int, token_data: Dict[str, Any]) -> None:
        """Update user's token in database."""
        expires_at = datetime.now() + timedelta(seconds=token_data.get("expires_in", 1200))
        
        self.db.execute(
            text("""
            UPDATE user_tokens 
            SET access_token = :access_token,
                refresh_token = :refresh_token,
                expires_at = :expires_at,
                updated_at = NOW()
            WHERE user_id = :user_id
            """),
            {
                "user_id": user_id,
                "access_token": token_data["access_token"],
                "refresh_token": token_data["refresh_token"],
                "expires_at": expires_at
            }
        )
        self.db.commit()
    
    def get_user_by_hh_id(self, hh_user_id: str) -> Optional[int]:
        """Get user ID by HeadHunter user ID."""
        result = self.db.execute(
            text("SELECT id FROM users WHERE hh_user_id = :hh_user_id"),
            {"hh_user_id": hh_user_id}
        ).fetchone()
        
        return result[0] if result else None
