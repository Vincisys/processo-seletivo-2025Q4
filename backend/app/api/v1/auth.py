"""
Rotas de autenticação
"""
from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, Form, Depends
from sqlalchemy.orm import Session

from app.schemas.auth import TokenResponse
from app.core.config import settings
from app.core.security import create_access_token
from app.services.user_service import UserService
from app.db.sessions import get_db


router = APIRouter(prefix="/integrations", tags=["Authentication"])


@router.post("/auth", response_model=TokenResponse, status_code=200)
def login(
    login: str = Form(...), 
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Autenticação com username e senha armazenados no banco de dados.
    
    Valida as credenciais contra a tabela de usuários e retorna um token JWT válido por 1 minuto.
    
    A senha é verificada usando bcrypt hash.
    """
    # Autenticar usuário via banco de dados
    user = UserService.authenticate_user(db, login, password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Criar token JWT
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id},
        expires_delta=access_token_expires
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60  # Converter para segundos
    )
