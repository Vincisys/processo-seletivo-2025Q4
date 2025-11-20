from app.domain.users.repository import UserRepository
from app.domain.users.schemas.user_schema import UserCreate
from passlib.context import CryptContext

_pwd_context = None


def get_pwd_context():
    global _pwd_context
    if _pwd_context is None:
        _pwd_context = CryptContext(
            schemes=["bcrypt"],
            bcrypt__default_rounds=12,
            deprecated="auto"
        )
    return _pwd_context


class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    def create_user(self, user_data: UserCreate):
        existing_user = self.repository.get_by_login(user_data.login)
        if existing_user:
            raise ValueError(f"Login {user_data.login} já está em uso")
        return self.repository.create(user_data)

    def get_user_by_login(self, login: str):
        return self.repository.get_by_login(login)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return get_pwd_context().verify(plain_password, hashed_password)

