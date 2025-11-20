import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base


class Asset(Base):
    __tablename__ = "assets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(140), nullable=False, index=True)
    category = Column(String(60), nullable=True)
    owner_id = Column(String(36), ForeignKey("owners.id"), nullable=False, index=True)

    owner = relationship("Owner", back_populates="assets")

