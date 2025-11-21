"""
Módulo de schemas Pydantic para validação e serialização de dados.

Define os modelos de dados usados na API para:
- Validação de entrada (Create/Update)
- Serialização de saída (Schema)
- Validação de tipos e formatos (email, UUID, tamanhos máximos)
"""

from pydantic import BaseModel, Field, UUID4, EmailStr, ConfigDict
from typing import Optional

class OwnerCreate(BaseModel):
    """
    Schema para criação de um responsável.
    
    Campos:
        name: Nome do responsável (máximo 140 caracteres)
        email: Email válido do responsável (máximo 140 caracteres)
        phone: Telefone do responsável (máximo 20 caracteres)
    """
    name: str = Field(..., max_length=140)
    email: EmailStr = Field(..., max_length=140)
    phone: str = Field(..., max_length=20)

class OwnerSchema(OwnerCreate):
    """
    Schema para representação de um responsável completo.
    
    Herda todos os campos de OwnerCreate e adiciona o ID.
    Usado para serialização de respostas da API.
    
    Campos:
        id: UUID único do responsável
    """
    id: UUID4
    
    model_config = ConfigDict(from_attributes=True)

class OwnerUpdate(BaseModel):
    """
    Schema para atualização parcial de um responsável.
    
    Todos os campos são opcionais - apenas os campos fornecidos serão atualizados.
    
    Campos:
        name: Nome do responsável (máximo 140 caracteres, opcional)
        email: Email válido do responsável (máximo 140 caracteres, opcional)
        phone: Telefone do responsável (máximo 20 caracteres, opcional)
    """
    name: Optional[str] = Field(None, max_length=140)
    email: Optional[EmailStr] = Field(None, max_length=140)
    phone: Optional[str] = Field(None, max_length=20)

class AssetCreate(BaseModel):
    """
    Schema para criação de um ativo.
    
    Campos:
        name: Nome do ativo (máximo 140 caracteres)
        category: Categoria do ativo (máximo 60 caracteres, ex.: "Aeronave", "Navio")
        owner_id: UUID do responsável ao qual o ativo pertence
    """
    name: str = Field(..., max_length=140)
    category: str = Field(..., max_length=60)
    owner_id: UUID4

class AssetSchema(AssetCreate):
    """
    Schema para representação de um ativo completo.
    
    Herda todos os campos de AssetCreate e adiciona o ID e referência ao responsável.
    Usado para serialização de respostas da API.
    
    Campos:
        id: UUID único do ativo
        owner_ref: Referência completa ao responsável (carregada via relacionamento)
    """
    id: UUID4
    owner_ref: Optional[OwnerSchema] = None 

    model_config = ConfigDict(from_attributes=True)

class AssetUpdate(BaseModel):
    """
    Schema para atualização parcial de um ativo.
    
    Todos os campos são opcionais - apenas os campos fornecidos serão atualizados.
    
    Campos:
        name: Nome do ativo (máximo 140 caracteres, opcional)
        category: Categoria do ativo (máximo 60 caracteres, opcional)
        owner_id: UUID do novo responsável (opcional)
    """
    name: Optional[str] = Field(None, max_length=140, description="Nome do ativo")
    category: Optional[str] = Field(None, max_length=60, description="Categoria (ex.: Aeronave, Navio)")
    owner_id: Optional[UUID4] = None

class Token(BaseModel):
    """
    Schema para resposta de autenticação.
    
    Campos:
        access_token: Token JWT de acesso
        token_type: Tipo do token (padrão: "bearer")
    """
    access_token: str
    token_type: str = "bearer"

class LoginData(BaseModel):
    """
    Schema para dados de login.
    
    Usado tanto para autenticação quanto para criação de usuários.
    
    Campos:
        login: Login do usuário
        password: Senha do usuário
    """
    login: str
    password: str

class UserSchema(BaseModel):
    """
    Schema para representação de um usuário.
    
    Usado para serialização de respostas da API.
    Não inclui a senha hasheada por segurança.
    
    Campos:
        id: ID único do usuário
        login: Login do usuário
        is_active: Status de ativação do usuário
    """
    id: int
    login: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
    