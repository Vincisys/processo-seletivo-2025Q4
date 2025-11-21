"""
Rotas da API para Users
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.schemas.user import UserUpdate, UserResponse
from app.services.user_service import UserService
from app.db.sessions import get_db
from app.core.security import get_current_user

router = APIRouter(tags=["Users"])


@router.put(
    "/user",
    response_model=UserResponse,
    summary="Atualizar próprio usuário",
    description="Atualiza os dados do usuário autenticado."
)
async def update_own_user(
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> UserResponse:
    """
    Atualiza o próprio usuário autenticado.
    
    Apenas os campos fornecidos serão atualizados.
    Se uma nova senha for fornecida, será armazenada com hash.
    O usuário só pode atualizar sua própria conta.
    """
    user_id = current_user["user_id"]
    
    try:
        db_user = UserService.update_user(db, user_id, user)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        return UserResponse.model_validate(db_user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete(
    "/user",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Deletar próprio usuário",
    description="Remove a conta do usuário autenticado do banco de dados."
)
async def delete_own_user(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Deleta a própria conta do usuário autenticado.
    
    Esta ação é irreversível. O usuário só pode deletar sua própria conta.
    """
    user_id = current_user["user_id"]
    
    deleted = UserService.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    return None
