"""
Testes unitários para os modelos de banco de dados
"""
import pytest
import uuid
from sqlalchemy.exc import IntegrityError

from app.db.models.owner import Owner
from app.db.models.asset import Asset


class TestOwnerModel:
    """Testes para o modelo Owner"""
    
    def test_create_owner(self, db_session):
        """Testa criação de um owner"""
        owner = Owner(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        db_session.add(owner)
        db_session.commit()
        
        assert owner.id is not None
        assert owner.name == "João da Silva"
        assert owner.email == "joao@empresa.com"
        assert owner.phone == "+55 11 98765-4321"
    
    def test_owner_id_is_uuid(self, db_session):
        """Testa que o ID do owner é um UUID válido"""
        owner = Owner(
            name="Maria Santos",
            email="maria@empresa.com",
            phone="+55 11 98765-4321"
        )
        db_session.add(owner)
        db_session.commit()
        
        # Validar que é um UUID válido
        try:
            uuid.UUID(owner.id)
            is_valid_uuid = True
        except ValueError:
            is_valid_uuid = False
        
        assert is_valid_uuid
    
    def test_owner_email_unique(self, db_session):
        """Testa que o email do owner deve ser único"""
        owner1 = Owner(
            name="João da Silva",
            email="mesmo@email.com",
            phone="+55 11 98765-4321"
        )
        db_session.add(owner1)
        db_session.commit()
        
        # Tentar criar outro owner com mesmo email
        owner2 = Owner(
            name="Maria Santos",
            email="mesmo@email.com",
            phone="+55 11 98765-9999"
        )
        db_session.add(owner2)
        
        with pytest.raises(IntegrityError):
            db_session.commit()
    
    def test_owner_required_fields(self, db_session):
        """Testa que campos obrigatórios não podem ser None"""
        owner = Owner()
        db_session.add(owner)
        
        with pytest.raises(IntegrityError):
            db_session.commit()
    
    def test_owner_repr(self, db_session):
        """Testa a representação string do owner"""
        owner = Owner(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        db_session.add(owner)
        db_session.commit()
        
        repr_str = repr(owner)
        assert "Owner" in repr_str
        assert owner.id in repr_str
        assert "João da Silva" in repr_str


class TestAssetModel:
    """Testes para o modelo Asset"""
    
    def test_create_asset(self, db_session):
        """Testa criação de um asset"""
        # Criar owner primeiro
        owner = Owner(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        db_session.add(owner)
        db_session.commit()
        
        # Criar asset
        asset = Asset(
            name="Aeronave Boeing 737",
            category="Aeronave",
            owner=owner.id
        )
        db_session.add(asset)
        db_session.commit()
        
        assert asset.id is not None
        assert asset.name == "Aeronave Boeing 737"
        assert asset.category == "Aeronave"
        assert asset.owner == owner.id
    
    def test_asset_id_is_uuid(self, db_session):
        """Testa que o ID do asset é um UUID válido"""
        owner = Owner(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        db_session.add(owner)
        db_session.commit()
        
        asset = Asset(
            name="Navio Cargueiro",
            category="Navio",
            owner=owner.id
        )
        db_session.add(asset)
        db_session.commit()
        
        # Validar que é um UUID válido
        try:
            uuid.UUID(asset.id)
            is_valid_uuid = True
        except ValueError:
            is_valid_uuid = False
        
        assert is_valid_uuid
    
    def test_asset_cascade_delete(self, db_session):
        """Testa que deletar owner deleta seus assets (CASCADE DELETE)"""
        # Criar owner
        owner = Owner(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        db_session.add(owner)
        db_session.commit()
        owner_id = owner.id
        
        # Criar assets
        asset1 = Asset(
            name="Aeronave Boeing 737",
            category="Aeronave",
            owner=owner_id
        )
        asset2 = Asset(
            name="Navio Cargueiro",
            category="Navio",
            owner=owner_id
        )
        db_session.add(asset1)
        db_session.add(asset2)
        db_session.commit()
        
        asset1_id = asset1.id
        asset2_id = asset2.id
        
        # Deletar owner
        db_session.delete(owner)
        db_session.commit()
        
        # Verificar que assets foram deletados
        assert db_session.query(Asset).filter(Asset.id == asset1_id).first() is None
        assert db_session.query(Asset).filter(Asset.id == asset2_id).first() is None
    
    def test_asset_foreign_key_constraint(self, db_session):
        """Testa que não é possível criar asset com owner inexistente"""
        asset = Asset(
            name="Aeronave Boeing 737",
            category="Aeronave",
            owner="00000000-0000-0000-0000-000000000000"  # Owner inexistente
        )
        db_session.add(asset)
        
        with pytest.raises(IntegrityError):
            db_session.commit()
    
    def test_asset_required_fields(self, db_session):
        """Testa que campos obrigatórios não podem ser None"""
        asset = Asset()
        db_session.add(asset)
        
        with pytest.raises(IntegrityError):
            db_session.commit()
    
    def test_asset_repr(self, db_session):
        """Testa a representação string do asset"""
        owner = Owner(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        db_session.add(owner)
        db_session.commit()
        
        asset = Asset(
            name="Aeronave Boeing 737",
            category="Aeronave",
            owner=owner.id
        )
        db_session.add(asset)
        db_session.commit()
        
        repr_str = repr(asset)
        assert "Asset" in repr_str
        assert asset.id in repr_str
        assert "Aeronave Boeing 737" in repr_str
