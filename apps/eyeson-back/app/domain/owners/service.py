from app.domain.owners.repository import OwnerRepository
from app.domain.owners.schemas.owner_schema import OwnerCreate, OwnerUpdate


class OwnerService:
    def __init__(self, repository: OwnerRepository):
        self.repository = repository

    def create_owner(self, owner_data: OwnerCreate):
        existing_owner = self.repository.get_by_email(owner_data.email)
        if existing_owner:
            raise ValueError(f"Email {owner_data.email} já está em uso")
        return self.repository.create(owner_data)

    def get_owner(self, owner_id: str):
        return self.repository.get_by_id(owner_id)

    def get_all_owners(self):
        return self.repository.get_all()

    def update_owner(self, owner_id: str, owner_data: OwnerUpdate):
        if owner_data.email is not None:
            existing_owner = self.repository.get_by_email(owner_data.email)
            if existing_owner and existing_owner.id != owner_id:
                raise ValueError(f"Email {owner_data.email} já está em uso")
        return self.repository.update(owner_id, owner_data)

    def delete_owner(self, owner_id: str):
        return self.repository.delete(owner_id)

