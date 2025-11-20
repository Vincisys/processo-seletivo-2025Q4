from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.domain.owners.models.owner_model import Owner
from app.domain.owners.schemas.owner_schema import OwnerCreate, OwnerUpdate
import uuid


class OwnerRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, owner_data: OwnerCreate):
        db_owner = Owner(
            id=str(uuid.uuid4()),
            name=owner_data.name,
            email=owner_data.email,
            phone=owner_data.phone
        )
        self.db.add(db_owner)
        try:
            self.db.commit()
            self.db.refresh(db_owner)
            return db_owner
        except IntegrityError:
            self.db.rollback()
            raise ValueError(f"Email {owner_data.email} já está em uso")

    def get_by_id(self, owner_id: str):
        return self.db.query(Owner).filter(Owner.id == owner_id).first()

    def get_all(self):
        return self.db.query(Owner).all()

    def update(self, owner_id: str, owner_data: OwnerUpdate):
        owner = self.get_by_id(owner_id)
        if not owner:
            return None
        
        if owner_data.name is not None:
            owner.name = owner_data.name
        if owner_data.email is not None:
            owner.email = owner_data.email
        if owner_data.phone is not None:
            owner.phone = owner_data.phone
        
        try:
            self.db.commit()
            self.db.refresh(owner)
            return owner
        except IntegrityError:
            self.db.rollback()
            email = owner_data.email if owner_data.email is not None else owner.email
            raise ValueError(f"Email {email} já está em uso")

    def delete(self, owner_id: str):
        owner = self.get_by_id(owner_id)
        if not owner:
            return False
        self.db.delete(owner)
        self.db.commit()
        return True

    def get_by_email(self, email: str):
        return self.db.query(Owner).filter(Owner.email == email).first()

