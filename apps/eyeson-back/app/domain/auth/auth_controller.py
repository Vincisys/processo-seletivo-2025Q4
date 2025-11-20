from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.domain.auth.schemas.auth_schema import LoginRequest, LoginResponse
from app.domain.auth.auth_service import authenticate_user, create_access_token
from app.domain.users.service import UserService
from app.domain.users.repository import UserRepository
from app.infrastructure.database import get_db

router = APIRouter(prefix="/integrations", tags=["auth"])


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    repository = UserRepository(db)
    return UserService(repository)


@router.post("/auth", response_model=LoginResponse, status_code=200)
def login(
    credentials: LoginRequest,
    user_service: UserService = Depends(get_user_service)
):
    user = authenticate_user(credentials.login, credentials.password, user_service)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login ou senha inválidos",
        )

    access_token = create_access_token(user.id)
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=1800,
    )

