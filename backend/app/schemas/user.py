"""
Schemas Pydantic para User
"""
from pydantic import BaseModel, Field, ConfigDict


class UserBase(BaseModel):
    """Schema base para User"""
    username: str = Field(
        ...,
        min_length=3,
        max_length=140,
        description="Nome de usuário",
        examples=["eyesonasset"]
    )


class UserCreate(UserBase):
    """Schema para criação de usuário"""
    password: str = Field(
        ...,
        min_length=6,
        max_length=100,
        description="Senha do usuário (será armazenada com hash)",
        examples=["senha123"]
    )


class UserUpdate(BaseModel):
    """Schema para atualização de usuário"""
    username: str | None = Field(
        None,
        min_length=3,
        max_length=140,
        description="Nome de usuário"
    )
    password: str | None = Field(
        None,
        min_length=6,
        max_length=100,
        description="Nova senha (será armazenada com hash)"
    )


class UserResponse(UserBase):
    """Schema para resposta de usuário (sem senha)"""
    id: str = Field(..., description="ID único do usuário")
    
    model_config = ConfigDict(from_attributes=True)


class UserInDB(UserBase):
    """Schema para usuário no banco de dados"""
    id: str
    hashed_password: str
    
    model_config = ConfigDict(from_attributes=True)
