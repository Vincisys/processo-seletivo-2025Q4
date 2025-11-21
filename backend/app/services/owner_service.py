from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from app.db.models.owner import Owner
from app.schemas.owner import OwnerCreate, OwnerUpdate


class OwnerService:
    """Serviço para operações CRUD de Owners"""

    @staticmethod
    def create_owner(db: Session, owner_data: OwnerCreate) -> Owner:
        """Cria um novo owner no banco de dados"""
        db_owner = Owner(
            name=owner_data.name,
            email=owner_data.email,
            phone=owner_data.phone
        )
        db.add(db_owner)
        try:
            db.commit()
            db.refresh(db_owner)
            return db_owner
        except IntegrityError:
            db.rollback()
            raise ValueError("Email já cadastrado")

    @staticmethod
    def get_owner(db: Session, owner_id: str) -> Optional[Owner]:
        """Busca um owner por ID"""
        return db.query(Owner).filter(Owner.id == owner_id).first()

    @staticmethod
    def get_owners(db: Session, skip: int = 0, limit: int = 100) -> List[Owner]:
        """Lista todos os owners com paginação"""
        return db.query(Owner).offset(skip).limit(limit).all()

    @staticmethod
    def update_owner(db: Session, owner_id: str, owner_data: OwnerUpdate) -> Optional[Owner]:
        """Atualiza um owner existente"""
        db_owner = db.query(Owner).filter(Owner.id == owner_id).first()
        if not db_owner:
            return None
        
        # Atualizar apenas os campos fornecidos
        update_data = owner_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_owner, field, value)

        try:
            db.commit()
            db.refresh(db_owner)
            return db_owner
        except IntegrityError:
            db.rollback()
            raise ValueError("Email já cadastrado")

    @staticmethod
    def delete_owner(db: Session, owner_id: str) -> bool:
        """
        Deleta um owner e seus assets relacionados (cascade delete).
        Retorna True se deletado com sucesso, False se não encontrado.
        """
        db_owner = db.query(Owner).filter(Owner.id == owner_id).first()
        if not db_owner:
            return False

        db.delete(db_owner)
        db.commit()
        return True
