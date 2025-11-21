"""
Configurações da aplicação
"""
import os
from typing import Optional


class Settings:
    """Configurações centralizadas da aplicação"""
    
    # API
    API_V1_PREFIX: str = "/integrations"
    PROJECT_NAME: str = "EyesOnAsset API"
    
    # JWT
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", 
        "your-secret-key-here-change-in-production-make-it-very-secure"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))  # 60 minutos (1 hora)
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./eyesonasset.db")


settings = Settings()
