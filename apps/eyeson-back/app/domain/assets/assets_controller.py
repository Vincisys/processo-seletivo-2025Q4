from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.domain.assets.repository import AssetRepository
from app.domain.assets.service import AssetService
from app.domain.assets.schemas.asset_schema import AssetCreate, AssetUpdate, AssetResponse
from app.domain.auth.dependencies import get_current_user
from typing import List


router = APIRouter(prefix="/integrations/asset", tags=["assets"])


def get_service(db: Session = Depends(get_db)) -> AssetService:
    repository = AssetRepository(db)
    return AssetService(repository)


@router.post("/", response_model=AssetResponse, status_code=201)
def create_asset(
    asset: AssetCreate,
    service: AssetService = Depends(get_service),
    current_user: str = Depends(get_current_user),
):
    return service.create_asset(asset)


@router.get("/", response_model=List[AssetResponse])
def get_assets(
    service: AssetService = Depends(get_service),
    current_user: str = Depends(get_current_user),
):
    return service.get_all_assets()


@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: str,
    service: AssetService = Depends(get_service),
    current_user: str = Depends(get_current_user),
):
    asset = service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.get("/owner/{owner_id}", response_model=List[AssetResponse])
def get_assets_by_owner(
    owner_id: str,
    service: AssetService = Depends(get_service),
    current_user: str = Depends(get_current_user),
):
    return service.get_assets_by_owner(owner_id)


@router.put("/{asset_id}", response_model=AssetResponse)
def update_asset(
    asset_id: str,
    asset: AssetUpdate,
    service: AssetService = Depends(get_service),
    current_user: str = Depends(get_current_user),
):
    result = service.update_asset(asset_id, asset)
    if not result:
        raise HTTPException(status_code=404, detail="Asset not found")
    return result


@router.delete("/{asset_id}", status_code=204)
def delete_asset(
    asset_id: str,
    service: AssetService = Depends(get_service),
    current_user: str = Depends(get_current_user),
):
    success = service.delete_asset(asset_id)
    if not success:
        raise HTTPException(status_code=404, detail="Asset not found")
    return None
