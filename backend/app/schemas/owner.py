from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional


class OwnerCreate(BaseModel):
    """Schema para criação de responsável"""
    name: str = Field(..., min_length=1, max_length=140, description="Nome completo")
    email: EmailStr = Field(..., max_length=140, description="Email corporativo")
    phone: str = Field(..., min_length=1, max_length=20, description="Telefone")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('O campo name não pode ser vazio')
        if len(v) > 140:
            raise ValueError('O campo name deve ter no máximo 140 caracteres')
        return v.strip()

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('O campo phone não pode ser vazio')
        if len(v) > 20:
            raise ValueError('O campo phone deve ter no máximo 20 caracteres')
        return v.strip()

    class Config:
        json_schema_extra = {
            "example": {
                "name": "João da Silva",
                "email": "joao.silva@empresa.com",
                "phone": "+55 11 98765-4321"
            }
        }


class OwnerUpdate(BaseModel):
    """Schema para atualização de responsável"""
    name: Optional[str] = Field(None, min_length=1, max_length=140, description="Nome completo")
    email: Optional[EmailStr] = Field(None, max_length=140, description="Email corporativo")
    phone: Optional[str] = Field(None, min_length=1, max_length=20, description="Telefone")

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

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            if not v or not v.strip():
                raise ValueError('O campo phone não pode ser vazio')
            if len(v) > 20:
                raise ValueError('O campo phone deve ter no máximo 20 caracteres')
            return v.strip()
        return v


class OwnerResponse(BaseModel):
    """Schema para resposta de responsável"""
    id: str
    name: str
    email: str
    phone: str

    class Config:
        from_attributes = True
