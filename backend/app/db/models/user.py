from sqlalchemy import Column, String
import uuid
from ..base import Base


class User(Base):
    """Modelo de Usuário (User) no banco de dados - Placeholder para Nível 5"""
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(140), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username})>"
