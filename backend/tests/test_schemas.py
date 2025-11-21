"""
Testes unitários para os schemas Pydantic
"""
import pytest
from pydantic import ValidationError

from app.schemas.owner import OwnerCreate, OwnerUpdate, OwnerResponse
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse


class TestOwnerSchemas:
    """Testes para os schemas de Owner"""
    
    def test_owner_create_valid(self):
        """Testa criação de OwnerCreate com dados válidos"""
        data = {
            "name": "João da Silva",
            "email": "joao.silva@empresa.com",
            "phone": "+55 11 98765-4321"
        }
        owner = OwnerCreate(**data)
        
        assert owner.name == "João da Silva"
        assert owner.email == "joao.silva@empresa.com"
        assert owner.phone == "+55 11 98765-4321"
    
    def test_owner_create_invalid_email(self):
        """Testa que email inválido gera erro"""
        data = {
            "name": "João da Silva",
            "email": "email-invalido",
            "phone": "+55 11 98765-4321"
        }
        
        with pytest.raises(ValidationError) as exc_info:
            OwnerCreate(**data)
        
        assert "email" in str(exc_info.value).lower()
    
    def test_owner_create_missing_required_field(self):
        """Testa que campos obrigatórios faltando geram erro"""
        data = {
            "name": "João da Silva",
            "phone": "+55 11 98765-4321"
            # email faltando
        }
        
        with pytest.raises(ValidationError) as exc_info:
            OwnerCreate(**data)
        
        assert "email" in str(exc_info.value).lower()
    
    def test_owner_create_name_too_long(self):
        """Testa que nome muito longo gera erro"""
        data = {
            "name": "A" * 141,  # Máximo é 140
            "email": "joao@empresa.com",
            "phone": "+55 11 98765-4321"
        }
        
        with pytest.raises(ValidationError) as exc_info:
            OwnerCreate(**data)
        
        assert "140" in str(exc_info.value) or "length" in str(exc_info.value).lower()
    
    def test_owner_update_partial(self):
        """Testa que OwnerUpdate aceita campos parciais"""
        # Apenas phone
        update = OwnerUpdate(phone="+55 11 99999-9999")
        assert update.phone == "+55 11 99999-9999"
        assert update.name is None
        assert update.email is None
        
        # Apenas name
        update = OwnerUpdate(name="João Silva Jr.")
        assert update.name == "João Silva Jr."
        assert update.phone is None
        assert update.email is None
    
    def test_owner_update_all_fields(self):
        """Testa OwnerUpdate com todos os campos"""
        update = OwnerUpdate(
            name="João Silva Jr.",
            email="joao.jr@empresa.com",
            phone="+55 11 99999-9999"
        )
        
        assert update.name == "João Silva Jr."
        assert update.email == "joao.jr@empresa.com"
        assert update.phone == "+55 11 99999-9999"
    
    def test_owner_response_with_id(self):
        """Testa OwnerResponse inclui ID"""
        data = {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "name": "João da Silva",
            "email": "joao@empresa.com",
            "phone": "+55 11 98765-4321"
        }
        owner = OwnerResponse(**data)
        
        assert owner.id == "550e8400-e29b-41d4-a716-446655440000"
        assert owner.name == "João da Silva"


class TestAssetSchemas:
    """Testes para os schemas de Asset"""
    
    def test_asset_create_valid(self):
        """Testa criação de AssetCreate com dados válidos"""
        data = {
            "name": "Aeronave Boeing 737",
            "category": "Aeronave",
            "owner": "550e8400-e29b-41d4-a716-446655440000"
        }
        asset = AssetCreate(**data)
        
        assert asset.name == "Aeronave Boeing 737"
        assert asset.category == "Aeronave"
        assert asset.owner == "550e8400-e29b-41d4-a716-446655440000"
    
    def test_asset_create_missing_required_field(self):
        """Testa que campos obrigatórios faltando geram erro"""
        data = {
            "name": "Aeronave Boeing 737",
            # category faltando
            "owner": "550e8400-e29b-41d4-a716-446655440000"
        }
        
        with pytest.raises(ValidationError) as exc_info:
            AssetCreate(**data)
        
        assert "category" in str(exc_info.value).lower()
    
    def test_asset_create_name_too_long(self):
        """Testa que nome muito longo gera erro"""
        data = {
            "name": "A" * 141,  # Máximo é 140
            "category": "Aeronave",
            "owner": "550e8400-e29b-41d4-a716-446655440000"
        }
        
        with pytest.raises(ValidationError) as exc_info:
            AssetCreate(**data)
        
        assert "140" in str(exc_info.value) or "length" in str(exc_info.value).lower()
    
    def test_asset_create_category_too_long(self):
        """Testa que categoria muito longa gera erro"""
        data = {
            "name": "Aeronave Boeing 737",
            "category": "A" * 61,  # Máximo é 60
            "owner": "550e8400-e29b-41d4-a716-446655440000"
        }
        
        with pytest.raises(ValidationError) as exc_info:
            AssetCreate(**data)
        
        assert "60" in str(exc_info.value) or "length" in str(exc_info.value).lower()
    
    def test_asset_update_partial(self):
        """Testa que AssetUpdate aceita campos parciais"""
        # Apenas name
        update = AssetUpdate(name="Aeronave Boeing 777")
        assert update.name == "Aeronave Boeing 777"
        assert update.category is None
        assert update.owner is None
        
        # Apenas category
        update = AssetUpdate(category="Aeronave Comercial")
        assert update.category == "Aeronave Comercial"
        assert update.name is None
        assert update.owner is None
    
    def test_asset_update_all_fields(self):
        """Testa AssetUpdate com todos os campos"""
        update = AssetUpdate(
            name="Aeronave Boeing 777",
            category="Aeronave Comercial",
            owner="550e8400-e29b-41d4-a716-446655440000"
        )
        
        assert update.name == "Aeronave Boeing 777"
        assert update.category == "Aeronave Comercial"
        assert update.owner == "550e8400-e29b-41d4-a716-446655440000"
    
    def test_asset_response_with_id(self):
        """Testa AssetResponse inclui ID"""
        data = {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "name": "Aeronave Boeing 737",
            "category": "Aeronave",
            "owner": "660e8400-e29b-41d4-a716-446655440000"
        }
        asset = AssetResponse(**data)
        
        assert asset.id == "550e8400-e29b-41d4-a716-446655440000"
        assert asset.name == "Aeronave Boeing 737"
        assert asset.owner == "660e8400-e29b-41d4-a716-446655440000"
