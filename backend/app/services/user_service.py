"""
Serviço de negócio para User
"""
from sqlalchemy.orm import Session
from typing import Optional

from app.db.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


class UserService:
    """Serviço para operações de negócio relacionadas a User"""
    
    @staticmethod
    def create_user(db: Session, user: UserCreate) -> User:
        """
        Cria um novo usuário no banco de dados.
        
        Args:
            db: Sessão do banco de dados
            user: Dados do usuário a ser criado
            
        Returns:
            Usuário criado
            
        Raises:
            ValueError: Se o username já estiver em uso
        """
        # Verificar se username já existe
        existing_user = db.query(User).filter(User.username == user.username).first()
        if existing_user:
            raise ValueError(f"Username '{user.username}' já está em uso")
        
        # Criar hash da senha
        hashed_password = get_password_hash(user.password)
        
        # Criar usuário
        db_user = User(
            username=user.username,
            hashed_password=hashed_password
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
        """
        Autentica um usuário verificando username e senha.
        
        Args:
            db: Sessão do banco de dados
            username: Nome de usuário
            password: Senha em texto plano
            
        Returns:
            Usuário autenticado ou None se credenciais inválidas
        """
        user = db.query(User).filter(User.username == username).first()
        
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        return user
    
    @staticmethod
    def get_user(db: Session, user_id: str) -> Optional[User]:
        """
        Busca um usuário por ID.
        
        Args:
            db: Sessão do banco de dados
            user_id: ID do usuário
            
        Returns:
            Usuário encontrado ou None
        """
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        """
        Busca um usuário por username.
        
        Args:
            db: Sessão do banco de dados
            username: Nome de usuário
            
        Returns:
            Usuário encontrado ou None
        """
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        """
        Lista todos os usuários com paginação.
        
        Args:
            db: Sessão do banco de dados
            skip: Número de registros a pular
            limit: Número máximo de registros a retornar
            
        Returns:
            Lista de usuários
        """
        return db.query(User).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_user(db: Session, user_id: str, user_update: UserUpdate) -> Optional[User]:
        """
        Atualiza um usuário existente.
        
        Args:
            db: Sessão do banco de dados
            user_id: ID do usuário a ser atualizado
            user_update: Dados para atualização
            
        Returns:
            Usuário atualizado ou None se não encontrado
            
        Raises:
            ValueError: Se o novo username já estiver em uso
        """
        db_user = db.query(User).filter(User.id == user_id).first()
        
        if not db_user:
            return None
        
        # Verificar se o novo username já está em uso por outro usuário
        if user_update.username and user_update.username != db_user.username:
            existing = db.query(User).filter(User.username == user_update.username).first()
            if existing:
                raise ValueError(f"Username '{user_update.username}' já está em uso")
            db_user.username = user_update.username
        
        # Atualizar senha se fornecida
        if user_update.password:
            db_user.hashed_password = get_password_hash(user_update.password)
        
        db.commit()
        db.refresh(db_user)
        
        return db_user
    
    @staticmethod
    def delete_user(db: Session, user_id: str) -> bool:
        """
        Deleta um usuário.
        
        Args:
            db: Sessão do banco de dados
            user_id: ID do usuário a ser deletado
            
        Returns:
            True se deletado com sucesso, False se não encontrado
        """
        db_user = db.query(User).filter(User.id == user_id).first()
        
        if not db_user:
            return False
        
        db.delete(db_user)
        db.commit()
        
        return True
