import pytest


def test_login_success(client):
    """Testa login com credenciais válidas"""
    login_data = {
        "login": "eyesonasset",
        "password": "eyesonasset"
    }
    
    response = client.post("/integrations/auth", json=login_data)
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] == 1800
    assert len(data["access_token"]) > 0


def test_login_invalid_credentials(client):
    """Testa login com credenciais inválidas"""
    login_data = {
        "login": "wrong",
        "password": "wrong"
    }
    
    response = client.post("/integrations/auth", json=login_data)
    
    assert response.status_code == 401
    assert "inválidos" in response.json()["detail"].lower() or "invalid" in response.json()["detail"].lower()


def test_login_missing_fields(client):
    """Testa login com campos faltando"""
    login_data = {
        "login": "eyesonasset"
        # password faltando
    }
    
    response = client.post("/integrations/auth", json=login_data)
    
    assert response.status_code == 422


def test_login_empty_credentials(client):
    """Testa login com credenciais vazias"""
    login_data = {
        "login": "",
        "password": ""
    }
    
    response = client.post("/integrations/auth", json=login_data)
    
    assert response.status_code == 401

