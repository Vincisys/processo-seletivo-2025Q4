from app.domain.assets.repository import AssetRepository
from app.domain.assets.schemas.asset_schema import AssetCreate, AssetUpdate


class AssetService:
    def __init__(self, repository: AssetRepository):
        self.repository = repository

    def create_asset(self, asset_data: AssetCreate):
        return self.repository.create(asset_data)

    def get_asset(self, asset_id: str):
        return self.repository.get_by_id(asset_id)

    def get_all_assets(self):
        return self.repository.get_all()

    def get_assets_by_owner(self, owner_id: str):
        return self.repository.get_by_owner_id(owner_id)

    def update_asset(self, asset_id: str, asset_data: AssetUpdate):
        return self.repository.update(asset_id, asset_data)

    def delete_asset(self, asset_id: str):
        return self.repository.delete(asset_id)

