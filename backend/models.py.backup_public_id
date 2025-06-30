"""Database models for JobHunter Pro."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
import uuid
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    """User model for storing user information."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    hh_user_id = Column(String(50), unique=True, index=True, nullable=False)  # ID from HeadHunter API
    email = Column(String(255), unique=True, index=True, nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    middle_name = Column(String(100))
    phone = Column(String(20))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    tokens = relationship("UserToken", back_populates="user", cascade="all, delete-orphan")
    professional_roles = relationship("UserProfessionalRole", back_populates="user", cascade="all, delete-orphan")


class UserToken(Base):
    """User token model for storing HH OAuth tokens."""
    
    __tablename__ = "user_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    access_token = Column(Text, nullable=False)  # Encrypted access token
    refresh_token = Column(Text, nullable=False)  # Encrypted refresh token
    expires_at = Column(DateTime(timezone=True), nullable=False)  # When access token expires
    token_type = Column(String(50), default="Bearer")
    scope = Column(String(255))  # OAuth scope
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="tokens")


class UserProfessionalRole(Base):
    """User professional roles extracted from HH resumes."""
    
    __tablename__ = "user_professional_roles"
    
    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role_id = Column(String(50), nullable=False)  # HH professional role ID
    role_name = Column(String(255), nullable=False)  # Role name
    is_primary = Column(Boolean, default=False)  # Primary role for smart search
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="professional_roles")
