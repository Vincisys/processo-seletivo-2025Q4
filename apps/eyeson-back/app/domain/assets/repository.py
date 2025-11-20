from sqlalchemy.orm import Session
from app.domain.assets.models.asset_model import Asset
from app.domain.assets.schemas.asset_schema import AssetCreate, AssetUpdate
import uuid


class AssetRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, asset_data: AssetCreate):
        db_asset = Asset(
            id=str(uuid.uuid4()),
            name=asset_data.name,
            category=asset_data.category,
            owner_id=asset_data.owner_id
        )
        self.db.add(db_asset)
        self.db.commit()
        self.db.refresh(db_asset)
        return db_asset

    def get_by_id(self, asset_id: str):
        return self.db.query(Asset).filter(Asset.id == asset_id).first()

    def get_all(self):
        return self.db.query(Asset).all()

    def get_by_owner_id(self, owner_id: str):
        return self.db.query(Asset).filter(Asset.owner_id == owner_id).all()

    def update(self, asset_id: str, asset_data: AssetUpdate):
        asset = self.get_by_id(asset_id)
        if not asset:
            return None
        
        if asset_data.name is not None:
            asset.name = asset_data.name
        if asset_data.category is not None:
            asset.category = asset_data.category
        if asset_data.owner_id is not None:
            asset.owner_id = asset_data.owner_id
        
        self.db.commit()
        self.db.refresh(asset)
        return asset

    def delete(self, asset_id: str):
        asset = self.get_by_id(asset_id)
        if not asset:
            return False
        self.db.delete(asset)
        self.db.commit()
        return True

