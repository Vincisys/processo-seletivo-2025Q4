from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.domain.owners.repository import OwnerRepository
from app.domain.owners.service import OwnerService
from app.domain.owners.schemas.owner_schema import OwnerCreate, OwnerUpdate, OwnerResponse
from app.domain.auth.dependencies import get_current_user
from typing import List


router = APIRouter(prefix="/integrations/owner", tags=["owners"])


def get_service(db: Session = Depends(get_db)) -> OwnerService:
    repository = OwnerRepository(db)
    return OwnerService(repository)


@router.post("/", response_model=OwnerResponse, status_code=201)
def create_owner(
    owner: OwnerCreate,
    service: OwnerService = Depends(get_service),
    current_user: str = Depends(get_current_user),
):
    try:
        return service.create_owner(owner)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.get("/", response_model=List[OwnerResponse])
def get_owners(
    service: OwnerService = Depends(get_service),
    current_user: str = Depends(get_current_user),
):
    return service.get_all_owners()


@router.get("/{owner_id}", response_model=OwnerResponse)
def get_owner(
    owner_id: str,
    service: OwnerService = Depends(get_service),
    current_user: str = Depends(get_current_user),
):
    owner = service.get_owner(owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")
    return owner


@router.put("/{owner_id}", response_model=OwnerResponse)
def update_owner(
    owner_id: str,
    owner: OwnerUpdate,
    service: OwnerService = Depends(get_service),
    current_user: str = Depends(get_current_user),
):
    try:
        result = service.update_owner(owner_id, owner)
        if not result:
            raise HTTPException(status_code=404, detail="Owner not found")
        return result
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.delete("/{owner_id}", status_code=204)
def delete_owner(
    owner_id: str,
    service: OwnerService = Depends(get_service),
    current_user: str = Depends(get_current_user),
):
    success = service.delete_owner(owner_id)
    if not success:
        raise HTTPException(status_code=404, detail="Owner not found")
    return None
