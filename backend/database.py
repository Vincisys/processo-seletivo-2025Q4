"""
Módulo de configuração do banco de dados e modelos SQLAlchemy.

Define:
- Configuração da conexão com o banco de dados
- Modelos de tabelas (User, Owner, Asset)
- Relacionamentos entre tabelas
- Funções de gerenciamento de sessão
"""

from sqlalchemy import create_engine, Column, String, Integer, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.dialects.postgresql import UUID 
import uuid

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

Base = declarative_base()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class User(Base):
    """
    Modelo de tabela para usuários do sistema.
    
    Campos:
        id: ID único do usuário (chave primária)
        login: Login único do usuário (índice único)
        hashed_password: Senha hasheada do usuário
        is_active: Status de ativação do usuário (padrão: True)
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

class Owner(Base):
    """
    Modelo de tabela para responsáveis (owners).
    
    Campos:
        id: UUID único do responsável (chave primária, gerado automaticamente)
        name: Nome do responsável (máximo 140 caracteres, indexado)
        email: Email único do responsável (máximo 140 caracteres, índice único)
        phone: Telefone do responsável (máximo 20 caracteres)
        
    Relacionamentos:
        assets: Lista de ativos associados (cascade delete configurado)
    """
    __tablename__ = "owners"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(140), index=True)
    email = Column(String(140), unique=True, index=True)
    phone = Column(String(20))

    assets = relationship("Asset", back_populates="owner_ref", cascade="all, delete-orphan")


class Asset(Base):
    """
    Modelo de tabela para ativos.
    
    Campos:
        id: UUID único do ativo (chave primária, gerado automaticamente)
        name: Nome do ativo (máximo 140 caracteres, indexado)
        category: Categoria do ativo (máximo 60 caracteres)
        owner_id: UUID do responsável (chave estrangeira para owners.id)
        
    Relacionamentos:
        owner_ref: Referência ao responsável (Owner) ao qual o ativo pertence
    """
    __tablename__ = "assets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(140), index=True)
    category = Column(String(60))
    owner_id = Column(UUID(as_uuid=True), ForeignKey("owners.id"))
    owner_ref = relationship("Owner", back_populates="assets")

def create_db_and_tables():
    """
    Cria todas as tabelas definidas nos modelos no banco de dados.
    
    Esta função deve ser chamada na inicialização da aplicação.
    Se as tabelas já existirem, não faz nada.
    """
    Base.metadata.create_all(bind=engine)

def get_db():
    """
    Dependency para obter uma sessão do banco de dados.
    
    Cria uma nova sessão, a disponibiliza para uso e garante
    que seja fechada ao final (mesmo em caso de exceção).
    
    Yields:
        Session: Sessão do banco de dados SQLAlchemy
    """
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()