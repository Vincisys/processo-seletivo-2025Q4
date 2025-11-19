from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from ..base import Base


class Owner(Base):
    """Modelo de Responsável (Owner) no banco de dados"""
    __tablename__ = "owners"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(140), nullable=False)
    email = Column(String(140), nullable=False, unique=True)
    phone = Column(String(20), nullable=False)

    # Relacionamento com Assets (cascade delete)
    assets = relationship(
        "Asset",
        back_populates="owner_rel",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def __repr__(self):
        return f"<Owner(id={self.id}, name={self.name}, email={self.email})>"
