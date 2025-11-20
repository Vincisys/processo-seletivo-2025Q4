#!/usr/bin/env python3
"""
Script para criar usuário padrão no banco de dados
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.db.models.user import User
from app.core.security import get_password_hash


# Configurar banco de dados
SQLALCHEMY_DATABASE_URL = "sqlite:///./eyesonasset.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Criar tabelas
Base.metadata.create_all(bind=engine)

# Criar sessão
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    # Verificar se usuário padrão já existe
    existing_user = db.query(User).filter(User.username == "eyesonasset").first()
    
    if existing_user:
        print("✅ Usuário 'eyesonasset' já existe no banco de dados")
        print(f"   ID: {existing_user.id}")
        print(f"   Username: {existing_user.username}")
    else:
        # Criar usuário padrão
        default_user = User(
            username="eyesonasset",
            hashed_password=get_password_hash("eyesonasset")
        )
        
        db.add(default_user)
        db.commit()
        db.refresh(default_user)
        
        print("✅ Usuário padrão criado com sucesso!")
        print(f"   ID: {default_user.id}")
        print(f"   Username: {default_user.username}")
        print(f"   Password: eyesonasset")
        print()
        print("🔐 Use estas credenciais para fazer login:")
        print("   POST /integrations/auth")
        print("   Body: login=eyesonasset&password=eyesonasset")

finally:
    db.close()
