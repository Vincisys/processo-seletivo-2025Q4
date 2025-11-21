"""
Testes unitários para os serviços (camada de negócio)
"""
import pytest

from app.services.owner_service import OwnerService
from app.services.asset_service import AssetService
from app.schemas.owner import OwnerCreate, OwnerUpdate
from app.schemas.asset import AssetCreate, AssetUpdate


class TestOwnerService:
    """Testes para o OwnerService"""
    
    def test_create_owner(self, db_session):
        """Testa criação de owner via service"""
        owner_data = OwnerCreate(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        
        owner = OwnerService.create_owner(db_session, owner_data)
        
        assert owner.id is not None
        assert owner.name == "João da Silva"
        assert owner.email == "joao@empresa.com"
        assert owner.phone == "+55 11 98765-4321"
    
    def test_create_owner_duplicate_email(self, db_session):
        """Testa que email duplicado gera erro"""
        owner_data1 = OwnerCreate(
            name="João da Silva",
            email="mesmo@email.com",
            phone="+55 11 98765-4321"
        )
        owner_data2 = OwnerCreate(
            name="Maria Santos",
            email="mesmo@email.com",
            phone="+55 11 98765-9999"
        )
        
        OwnerService.create_owner(db_session, owner_data1)
        
        with pytest.raises(ValueError, match="Email já cadastrado"):
            OwnerService.create_owner(db_session, owner_data2)
    
    def test_get_owner(self, db_session):
        """Testa busca de owner por ID"""
        owner_data = OwnerCreate(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        created = OwnerService.create_owner(db_session, owner_data)
        
        found = OwnerService.get_owner(db_session, created.id)
        
        assert found is not None
        assert found.id == created.id
        assert found.name == "João da Silva"
    
    def test_get_owner_not_found(self, db_session):
        """Testa busca de owner inexistente"""
        found = OwnerService.get_owner(db_session, "00000000-0000-0000-0000-000000000000")
        
        assert found is None
    
    def test_get_owners_list(self, db_session):
        """Testa listagem de owners"""
        # Criar múltiplos owners
        for i in range(5):
            owner_data = OwnerCreate(
                name=f"Owner {i}",
                email=f"owner{i}@empresa.com",
                phone="+55 11 98765-4321"
            )
            OwnerService.create_owner(db_session, owner_data)
        
        owners = OwnerService.get_owners(db_session)
        
        assert len(owners) == 5
    
    def test_get_owners_pagination(self, db_session):
        """Testa paginação de owners"""
        # Criar 10 owners
        for i in range(10):
            owner_data = OwnerCreate(
                name=f"Owner {i}",
                email=f"owner{i}@empresa.com",
                phone="+55 11 98765-4321"
            )
            OwnerService.create_owner(db_session, owner_data)
        
        # Buscar com paginação
        page1 = OwnerService.get_owners(db_session, skip=0, limit=5)
        page2 = OwnerService.get_owners(db_session, skip=5, limit=5)
        
        assert len(page1) == 5
        assert len(page2) == 5
        assert page1[0].id != page2[0].id
    
    def test_update_owner(self, db_session):
        """Testa atualização de owner"""
        owner_data = OwnerCreate(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        created = OwnerService.create_owner(db_session, owner_data)
        
        update_data = OwnerUpdate(phone="+55 11 99999-9999")
        updated = OwnerService.update_owner(db_session, created.id, update_data)
        
        assert updated is not None
        assert updated.phone == "+55 11 99999-9999"
        assert updated.name == "João da Silva"  # Não mudou
    
    def test_update_owner_not_found(self, db_session):
        """Testa atualização de owner inexistente"""
        update_data = OwnerUpdate(phone="+55 11 99999-9999")
        updated = OwnerService.update_owner(
            db_session, 
            "00000000-0000-0000-0000-000000000000", 
            update_data
        )
        
        assert updated is None
    
    def test_delete_owner(self, db_session):
        """Testa deleção de owner"""
        owner_data = OwnerCreate(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        created = OwnerService.create_owner(db_session, owner_data)
        
        result = OwnerService.delete_owner(db_session, created.id)
        
        assert result is True
        assert OwnerService.get_owner(db_session, created.id) is None
    
    def test_delete_owner_not_found(self, db_session):
        """Testa deleção de owner inexistente"""
        result = OwnerService.delete_owner(db_session, "00000000-0000-0000-0000-000000000000")
        
        assert result is False


class TestAssetService:
    """Testes para o AssetService"""
    
    def test_create_asset(self, db_session):
        """Testa criação de asset via service"""
        # Criar owner primeiro
        owner_data = OwnerCreate(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        owner = OwnerService.create_owner(db_session, owner_data)
        
        # Criar asset
        asset_data = AssetCreate(
            name="Aeronave Boeing 737",
            category="Aeronave",
            owner=owner.id
        )
        asset = AssetService.create_asset(db_session, asset_data)
        
        assert asset.id is not None
        assert asset.name == "Aeronave Boeing 737"
        assert asset.category == "Aeronave"
        assert asset.owner == owner.id
    
    def test_get_asset(self, db_session):
        """Testa busca de asset por ID"""
        # Criar owner
        owner_data = OwnerCreate(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        owner = OwnerService.create_owner(db_session, owner_data)
        
        # Criar asset
        asset_data = AssetCreate(
            name="Aeronave Boeing 737",
            category="Aeronave",
            owner=owner.id
        )
        created = AssetService.create_asset(db_session, asset_data)
        
        # Buscar
        found = AssetService.get_asset(db_session, created.id)
        
        assert found is not None
        assert found.id == created.id
        assert found.name == "Aeronave Boeing 737"
    
    def test_get_asset_not_found(self, db_session):
        """Testa busca de asset inexistente"""
        found = AssetService.get_asset(db_session, "00000000-0000-0000-0000-000000000000")
        
        assert found is None
    
    def test_get_assets_list(self, db_session):
        """Testa listagem de assets"""
        # Criar owner
        owner_data = OwnerCreate(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        owner = OwnerService.create_owner(db_session, owner_data)
        
        # Criar múltiplos assets
        for i in range(5):
            asset_data = AssetCreate(
                name=f"Asset {i}",
                category="Categoria",
                owner=owner.id
            )
            AssetService.create_asset(db_session, asset_data)
        
        assets = AssetService.get_assets(db_session)
        
        assert len(assets) == 5
    
    def test_get_assets_pagination(self, db_session):
        """Testa paginação de assets"""
        # Criar owner
        owner_data = OwnerCreate(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        owner = OwnerService.create_owner(db_session, owner_data)
        
        # Criar 10 assets
        for i in range(10):
            asset_data = AssetCreate(
                name=f"Asset {i}",
                category="Categoria",
                owner=owner.id
            )
            AssetService.create_asset(db_session, asset_data)
        
        # Buscar com paginação
        page1 = AssetService.get_assets(db_session, skip=0, limit=5)
        page2 = AssetService.get_assets(db_session, skip=5, limit=5)
        
        assert len(page1) == 5
        assert len(page2) == 5
        assert page1[0].id != page2[0].id
    
    def test_update_asset(self, db_session):
        """Testa atualização de asset"""
        # Criar owner
        owner_data = OwnerCreate(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        owner = OwnerService.create_owner(db_session, owner_data)
        
        # Criar asset
        asset_data = AssetCreate(
            name="Aeronave Boeing 737",
            category="Aeronave",
            owner=owner.id
        )
        created = AssetService.create_asset(db_session, asset_data)
        
        # Atualizar
        update_data = AssetUpdate(name="Aeronave Boeing 777")
        updated = AssetService.update_asset(db_session, created.id, update_data)
        
        assert updated is not None
        assert updated.name == "Aeronave Boeing 777"
        assert updated.category == "Aeronave"  # Não mudou
    
    def test_update_asset_not_found(self, db_session):
        """Testa atualização de asset inexistente"""
        update_data = AssetUpdate(name="Aeronave Boeing 777")
        updated = AssetService.update_asset(
            db_session, 
            "00000000-0000-0000-0000-000000000000", 
            update_data
        )
        
        assert updated is None
    
    def test_delete_asset(self, db_session):
        """Testa deleção de asset"""
        # Criar owner
        owner_data = OwnerCreate(
            name="João da Silva",
            email="joao@empresa.com",
            phone="+55 11 98765-4321"
        )
        owner = OwnerService.create_owner(db_session, owner_data)
        
        # Criar asset
        asset_data = AssetCreate(
            name="Aeronave Boeing 737",
            category="Aeronave",
            owner=owner.id
        )
        created = AssetService.create_asset(db_session, asset_data)
        
        # Deletar
        result = AssetService.delete_asset(db_session, created.id)
        
        assert result is True
        assert AssetService.get_asset(db_session, created.id) is None
    
    def test_delete_asset_not_found(self, db_session):
        """Testa deleção de asset inexistente"""
        result = AssetService.delete_asset(db_session, "00000000-0000-0000-0000-000000000000")
        
        assert result is False
