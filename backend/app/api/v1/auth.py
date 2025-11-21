"""
Rotas de autenticação
"""
from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, Form, Depends
from sqlalchemy.orm import Session

from app.schemas.auth import TokenResponse
from app.schemas.user import UserCreate, UserResponse
from app.core.config import settings
from app.core.security import create_access_token
from app.services.user_service import UserService
from app.db.sessions import get_db


router = APIRouter(tags=["Authentication"])


@router.post(
    "/cadastro",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar novo usuário",
    description="Cria uma nova conta de usuário no sistema."
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Registra um novo usuário no sistema.
    
    - **username**: Nome de usuário único (3-140 caracteres)
    - **password**: Senha (mínimo 6 caracteres)
    
    A senha é armazenada com hash bcrypt para segurança.
    Retorna erro 400 se o username já existir.
    """
    try:
        db_user = UserService.create_user(db, user)
        return UserResponse.model_validate(db_user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Login de usuário",
    description="Autentica um usuário e retorna um token JWT."
)
def login(
    username: str = Form(..., description="Nome de usuário"),
    password: str = Form(..., description="Senha do usuário"),
    db: Session = Depends(get_db)
):
    """
    Autentica um usuário com username e senha.
    
    Valida as credenciais contra a tabela de usuários e retorna um token JWT válido por 60 minutos.
    A senha é verificada usando bcrypt hash.
    
    Retorna 401 se as credenciais forem inválidas.
    """
    # Autenticar usuário via banco de dados
    user = UserService.authenticate_user(db, username, password)
    
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
