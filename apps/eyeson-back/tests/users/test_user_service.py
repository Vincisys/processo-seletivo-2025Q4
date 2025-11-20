import pytest
from app.domain.users.service import UserService
from app.domain.users.repository import UserRepository
from app.domain.users.schemas.user_schema import UserCreate


def test_create_user(db_session):
    """Testa criação de usuário"""
    repository = UserRepository(db_session)
    service = UserService(repository)
    
    user_data = UserCreate(login="testuser", password="testpass123")
    user = service.create_user(user_data)
    
    assert user is not None
    assert user.login == "testuser"
    assert user.password != "testpass123"
    assert user.id is not None


def test_create_user_duplicate_login(db_session):
    """Testa criação de usuário com login duplicado"""
    repository = UserRepository(db_session)
    service = UserService(repository)
    
    user_data = UserCreate(login="testuser", password="testpass123")
    service.create_user(user_data)
    
    with pytest.raises(ValueError, match="já está em uso"):
        service.create_user(user_data)


def test_get_user_by_login(db_session):
    """Testa busca de usuário por login"""
    repository = UserRepository(db_session)
    service = UserService(repository)
    
    user_data = UserCreate(login="testuser", password="testpass123")
    created_user = service.create_user(user_data)
    
    found_user = service.get_user_by_login("testuser")
    
    assert found_user is not None
    assert found_user.id == created_user.id
    assert found_user.login == "testuser"


def test_verify_password(db_session):
    """Testa verificação de senha"""
    repository = UserRepository(db_session)
    service = UserService(repository)
    
    user_data = UserCreate(login="testuser", password="testpass123")
    user = service.create_user(user_data)
    
    assert service.verify_password("testpass123", user.password) is True
    assert service.verify_password("wrongpass", user.password) is False


def test_password_is_hashed(db_session):
    """Testa se a senha está sendo hasheada corretamente"""
    repository = UserRepository(db_session)
    service = UserService(repository)
    
    user_data = UserCreate(login="testuser", password="testpass123")
    user = service.create_user(user_data)
    
    assert user.password != "testpass123"
    assert len(user.password) > 20
    assert user.password.startswith("$2b$")

