from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.domain.users.models.user_model import User
from app.domain.users.schemas.user_schema import UserCreate
from passlib.context import CryptContext
import uuid

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


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_data: UserCreate):
        hashed_password = get_pwd_context().hash(user_data.password)
        db_user = User(
            id=str(uuid.uuid4()),
            login=user_data.login,
            password=hashed_password
        )
        self.db.add(db_user)
        try:
            self.db.commit()
            self.db.refresh(db_user)
            return db_user
        except IntegrityError:
            self.db.rollback()
            raise ValueError(f"Login {user_data.login} já está em uso")

    def get_by_id(self, user_id: str):
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_login(self, login: str):
        return self.db.query(User).filter(User.login == login).first()

