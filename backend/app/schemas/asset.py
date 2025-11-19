from pydantic import BaseModel, Field, field_validator
from uuid import UUID
from typing import Optional


class AssetCreate(BaseModel):
    """Schema para criação de ativo - Nível 1 (validação apenas)"""
    id: UUID = Field(..., description="Identificação do ativo (UUID)")
    name: str = Field(..., min_length=1, max_length=140, description="Nome do ativo")
    category: str = Field(..., min_length=1, max_length=60, description="Categoria do ativo")
    owner: UUID = Field(..., description="ID do responsável (UUID)")

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
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "Aeronave Boeing 737",
                "category": "Aeronave",
                "owner": "123e4567-e89b-12d3-a456-426614174001"
            }
        }


class AssetResponse(BaseModel):
    """Schema para resposta de ativo"""
    id: UUID
    name: str
    category: str
    owner: UUID

    class Config:
        from_attributes = True
