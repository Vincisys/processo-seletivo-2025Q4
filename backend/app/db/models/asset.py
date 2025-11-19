from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from ..base import Base


class Asset(Base):
    """Modelo de Ativo (Asset) no banco de dados"""
    __tablename__ = "assets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(140), nullable=False)
    category = Column(String(60), nullable=False)
    owner = Column(String(36), ForeignKey("owners.id", ondelete="CASCADE"), nullable=False)

    # Relacionamento com Owner
    owner_rel = relationship("Owner", back_populates="assets")

    def __repr__(self):
        return f"<Asset(id={self.id}, name={self.name}, category={self.category})>"
