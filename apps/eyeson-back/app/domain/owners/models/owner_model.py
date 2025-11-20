import uuid
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base


class Owner(Base):
    __tablename__ = "owners"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(140), nullable=False)
    email = Column(String(140), nullable=False, unique=True, index=True)
    phone = Column(String(14), nullable=False)

    assets = relationship("Asset", back_populates="owner", cascade="all, delete-orphan")

