from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.domain.users.service import UserService
from app.domain.users.repository import UserRepository
from app.domain.users.schemas.user_schema import UserCreate, UserResponse

router = APIRouter(prefix="/integrations/user", tags=["users"])


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    repository = UserRepository(db)
    return UserService(repository)


@router.post("/", response_model=UserResponse, status_code=201)
def create_user(
    user_data: UserCreate,
    user_service: UserService = Depends(get_user_service),
):
    try:
        user = user_service.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

