import pytest


def test_create_owner(authenticated_client, sample_owner_data):
    """Testa a criação de um owner via endpoint POST"""
    response = authenticated_client.post("/integrations/owner/", json=sample_owner_data)
    
    assert response.status_code == 201, f"Esperado 201, recebido {response.status_code}. Resposta: {response.text}"

    data = response.json()
    assert data["name"] == sample_owner_data["name"]
    assert data["email"] == sample_owner_data["email"]
    assert data["phone"] == sample_owner_data["phone"]
    assert "id" in data


def test_create_owner_duplicate_email(authenticated_client, sample_owner_data):
    """Testa que não é possível criar dois owners com o mesmo email"""
    # Cria o primeiro owner
    response1 = authenticated_client.post("/integrations/owner/", json=sample_owner_data)
    assert response1.status_code == 201
    
    # Tenta criar outro com o mesmo email
    response2 = authenticated_client.post("/integrations/owner/", json=sample_owner_data)
    assert response2.status_code == 409  # Conflito
    assert "já está em uso" in response2.json()["detail"].lower() or "already" in response2.json()["detail"].lower()


def test_create_owner_invalid_data(authenticated_client):
    """Testa que dados inválidos retornam erro 422"""
    invalid_data = {
        "name": "Test",
        # Faltando email e phone
    }

    response = authenticated_client.post("/integrations/owner/", json=invalid_data)
    assert response.status_code == 422  # Entidade não processável


def test_create_owner_without_auth(client, sample_owner_data):
    """Testa que criar owner sem autenticação retorna 403"""
    response = client.post("/integrations/owner/", json=sample_owner_data)
    assert response.status_code == 403

