from fastapi import APIRouter, HTTPException, status
from app.domain.auth.schemas.auth_schema import LoginRequest, LoginResponse
from app.domain.auth.auth_service import authenticate_user, create_access_token

router = APIRouter(prefix="/integrations", tags=["auth"])


@router.post("/auth", response_model=LoginResponse, status_code=200)
def login(credentials: LoginRequest):
    if not authenticate_user(credentials.login, credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login ou senha inválidos",
        )

    access_token = create_access_token()
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=1800,
    )

