from sqlalchemy.orm import Session
from app.domain.users.service import UserService
from app.domain.users.repository import UserRepository
from app.domain.users.schemas.user_schema import UserCreate


def seed_initial_user(db: Session):
    user_repository = UserRepository(db)
    user_service = UserService(user_repository)
    
    existing_user = user_service.get_user_by_login("eyesonasset")
    if existing_user:
        print("Usuário 'eyesonasset' já existe no banco de dados")
        return
    
    try:
        user = user_service.create_user(UserCreate(login="eyesonasset", password="eyesonasset"))
        print(f"Usuário inicial 'eyesonasset' criado com sucesso (ID: {user.id})")
    except Exception as e:
        print(f"Erro ao criar usuário inicial: {e}")
        raise

