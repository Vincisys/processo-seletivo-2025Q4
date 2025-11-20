import pytest
from app.domain.users.service import UserService
from app.domain.users.repository import UserRepository
from app.domain.users.schemas.user_schema import UserCreate
from app.domain.auth.auth_service import authenticate_user, create_access_token, verify_token


def test_authenticate_user_with_valid_credentials(db_session):
    """Testa autenticação com credenciais válidas do banco"""
    repository = UserRepository(db_session)
    service = UserService(repository)
    
    user_data = UserCreate(login="testuser", password="testpass123")
    service.create_user(user_data)
    
    user = authenticate_user("testuser", "testpass123", service)
    
    assert user is not None
    assert user.login == "testuser"


def test_authenticate_user_with_invalid_login(db_session):
    """Testa autenticação com login inválido"""
    repository = UserRepository(db_session)
    service = UserService(repository)
    
    user = authenticate_user("nonexistent", "testpass123", service)
    
    assert user is None


def test_authenticate_user_with_invalid_password(db_session):
    """Testa autenticação com senha inválida"""
    repository = UserRepository(db_session)
    service = UserService(repository)
    
    user_data = UserCreate(login="testuser", password="testpass123")
    service.create_user(user_data)
    
    user = authenticate_user("testuser", "wrongpass", service)
    
    assert user is None


def test_create_access_token_with_user_id():
    """Testa criação de token JWT com user_id"""
    user_id = "test-user-id-123"
    token = create_access_token(user_id)
    
    assert token is not None
    assert len(token) > 0
    
    decoded_user_id = verify_token(token)
    assert decoded_user_id == user_id


def test_verify_token_with_valid_token():
    """Testa verificação de token válido"""
    user_id = "test-user-id-123"
    token = create_access_token(user_id)
    
    decoded_user_id = verify_token(token)
    assert decoded_user_id == user_id


def test_verify_token_with_invalid_token():
    """Testa verificação de token inválido"""
    from fastapi import HTTPException
    
    invalid_token = "invalid.token.here"
    
    with pytest.raises(HTTPException) as exc_info:
        verify_token(invalid_token)
    
    assert exc_info.value.status_code == 401

