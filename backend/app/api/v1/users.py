"""
Rotas da API para Users
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List

from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services.user_service import UserService
from app.db.sessions import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/integrations", tags=["Users"])


@router.post(
    "/user",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar um novo usuário",
    description="Cria um novo usuário no banco de dados. O ID é gerado automaticamente e a senha é armazenada com hash bcrypt."
)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> UserResponse:
    """
    Cria um novo usuário com os seguintes campos obrigatórios:
    
    - **username**: Nome de usuário único (3-140 caracteres)
    - **password**: Senha (mínimo 6 caracteres, será armazenada com hash)
    
    O ID do usuário é gerado automaticamente pelo sistema.
    A senha é armazenada com hash bcrypt para segurança.
    """
    try:
        db_user = UserService.create_user(db, user)
        return UserResponse.model_validate(db_user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "/user/{user_id}",
    response_model=UserResponse,
    summary="Buscar usuário por ID",
    description="Retorna os dados de um usuário específico pelo ID (sem a senha)."
)
async def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> UserResponse:
    """
    Busca um usuário pelo ID.
    
    Retorna 404 se o usuário não for encontrado.
    A senha não é retornada por segurança.
    """
    db_user = UserService.get_user(db, user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User com ID {user_id} não encontrado"
        )
    return UserResponse.model_validate(db_user)


@router.get(
    "/users",
    response_model=List[UserResponse],
    summary="Listar todos os usuários",
    description="Retorna uma lista de todos os usuários cadastrados (sem as senhas)."
)
async def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> List[UserResponse]:
    """
    Lista todos os usuários com paginação.
    
    - **skip**: Número de registros a pular (padrão: 0)
    - **limit**: Número máximo de registros a retornar (padrão: 100)
    
    As senhas não são retornadas por segurança.
    """
    users = UserService.get_users(db, skip=skip, limit=limit)
    return [UserResponse.model_validate(user) for user in users]


@router.put(
    "/user/{user_id}",
    response_model=UserResponse,
    summary="Atualizar usuário",
    description="Atualiza os dados de um usuário existente."
)
async def update_user(
    user_id: str,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
) -> UserResponse:
    """
    Atualiza um usuário existente.
    
    Apenas os campos fornecidos serão atualizados.
    Se uma nova senha for fornecida, será armazenada com hash.
    Retorna 404 se o usuário não for encontrado.
    """
    try:
        db_user = UserService.update_user(db, user_id, user)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User com ID {user_id} não encontrado"
            )
        return UserResponse.model_validate(db_user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete(
    "/user/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Deletar usuário",
    description="Remove um usuário do banco de dados."
)
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Deleta um usuário pelo ID.
    
    Retorna 404 se o usuário não for encontrado.
    """
    deleted = UserService.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User com ID {user_id} não encontrado"
        )
    return None
