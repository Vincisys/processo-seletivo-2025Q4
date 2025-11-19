from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from typing import Optional


class AssetCreate(BaseModel):
    """Schema para criação de ativo - Nível 2 (sem ID, gerado automaticamente)"""
    name: str = Field(..., min_length=1, max_length=140, description="Nome do ativo")
    category: str = Field(..., min_length=1, max_length=60, description="Categoria do ativo")
    owner: str = Field(..., description="ID do responsável (UUID)")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('O campo name não pode ser vazio')
        if len(v) > 140:
            raise ValueError('O campo name deve ter no máximo 140 caracteres')
        return v.strip()

    @field_validator('category')
    @classmethod
    def validate_category(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('O campo category não pode ser vazio')
        if len(v) > 60:
            raise ValueError('O campo category deve ter no máximo 60 caracteres')
        return v.strip()

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Aeronave Boeing 737",
                "category": "Aeronave",
                "owner": "123e4567-e89b-12d3-a456-426614174001"
            }
        }


class AssetUpdate(BaseModel):
    """Schema para atualização de ativo"""
    name: Optional[str] = Field(None, min_length=1, max_length=140, description="Nome do ativo")
    category: Optional[str] = Field(None, min_length=1, max_length=60, description="Categoria do ativo")
    owner: Optional[str] = Field(None, description="ID do responsável (UUID)")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            if not v or not v.strip():
                raise ValueError('O campo name não pode ser vazio')
            if len(v) > 140:
                raise ValueError('O campo name deve ter no máximo 140 caracteres')
            return v.strip()
        return v

    @field_validator('category')
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            if not v or not v.strip():
                raise ValueError('O campo category não pode ser vazio')
            if len(v) > 60:
                raise ValueError('O campo category deve ter no máximo 60 caracteres')
            return v.strip()
        return v


class AssetResponse(BaseModel):
    """Schema para resposta de ativo"""
    id: str
    name: str
    category: str
    owner: str

    class Config:
        from_attributes = True

