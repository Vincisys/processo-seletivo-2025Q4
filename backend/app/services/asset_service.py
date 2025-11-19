from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.models.asset import Asset
from app.schemas.asset import AssetCreate, AssetUpdate


class AssetService:
    """Serviço para operações CRUD de Assets"""

    @staticmethod
    def create_asset(db: Session, asset_data: AssetCreate) -> Asset:
        """Cria um novo asset no banco de dados"""
        db_asset = Asset(
            name=asset_data.name,
            category=asset_data.category,
            owner=asset_data.owner
        )
        db.add(db_asset)
        db.commit()
        db.refresh(db_asset)
        return db_asset

    @staticmethod
    def get_asset(db: Session, asset_id: str) -> Optional[Asset]:
        """Busca um asset por ID"""
        return db.query(Asset).filter(Asset.id == asset_id).first()

    @staticmethod
    def get_assets(db: Session, skip: int = 0, limit: int = 100) -> List[Asset]:
        """Lista todos os assets com paginação"""
        return db.query(Asset).offset(skip).limit(limit).all()

    @staticmethod
    def update_asset(db: Session, asset_id: str, asset_data: AssetUpdate) -> Optional[Asset]:
        """Atualiza um asset existente"""
        db_asset = db.query(Asset).filter(Asset.id == asset_id).first()
        if not db_asset:
            return None

        # Atualizar apenas os campos fornecidos
        update_data = asset_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_asset, field, value)

        db.commit()
        db.refresh(db_asset)
        return db_asset

    @staticmethod
    def delete_asset(db: Session, asset_id: str) -> bool:
        """Deleta um asset"""
        db_asset = db.query(Asset).filter(Asset.id == asset_id).first()
        if not db_asset:
            return False

        db.delete(db_asset)
        db.commit()
        return True
