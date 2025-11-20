import pytest


def test_update_owner(authenticated_client, sample_owner_data):
    """Testa atualizar um owner existente"""
    # Cria um owner
    created_owner = authenticated_client.post("/integrations/owner/", json=sample_owner_data).json()
    owner_id = created_owner["id"]
    
    # Atualiza o owner
    update_data = {
        "name": "João Silva Atualizado",
        "email": "joao.novo@example.com",
        "phone": "74999999999"
    }
    response = authenticated_client.put(f"/integrations/owner/{owner_id}", json=update_data)
    
    assert response.status_code == 200
    updated_owner = response.json()
    assert updated_owner["id"] == owner_id
    assert updated_owner["name"] == update_data["name"]
    assert updated_owner["email"] == update_data["email"]
    assert updated_owner["phone"] == update_data["phone"]


def test_update_owner_partial(authenticated_client, sample_owner_data):
    """Testa atualizar apenas alguns campos do owner"""
    # Cria um owner
    created_owner = authenticated_client.post("/integrations/owner/", json=sample_owner_data).json()
    owner_id = created_owner["id"]
    
    # Atualiza apenas o nome
    update_data = {
        "name": "João Silva Modificado"
    }
    response = authenticated_client.put(f"/integrations/owner/{owner_id}", json=update_data)
    
    assert response.status_code == 200
    updated_owner = response.json()
    assert updated_owner["id"] == owner_id
    assert updated_owner["name"] == update_data["name"]
    # Campos não atualizados devem permanecer iguais
    assert updated_owner["email"] == sample_owner_data["email"]
    assert updated_owner["phone"] == sample_owner_data["phone"]


def test_update_owner_not_found(authenticated_client):
    """Testa atualizar um owner que não existe"""
    update_data = {
        "name": "Teste"
    }
    response = authenticated_client.put("/integrations/owner/non-existent-id", json=update_data)
    
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_update_owner_duplicate_email(authenticated_client, sample_owner_data):
    """Testa que não é possível atualizar um owner com email já em uso"""
    # Cria dois owners
    owner1 = authenticated_client.post("/integrations/owner/", json=sample_owner_data).json()
    
    owner2_data = {
        "name": "Maria Santos",
        "email": "maria@example.com",
        "phone": "11987654321"
    }
    owner2 = authenticated_client.post("/integrations/owner/", json=owner2_data).json()
    
    # Tenta atualizar o owner2 com o email do owner1
    update_data = {
        "email": sample_owner_data["email"]
    }
    response = authenticated_client.put(f"/integrations/owner/{owner2['id']}", json=update_data)
    
    assert response.status_code == 409  # Conflict
    assert "já está em uso" in response.json()["detail"].lower() or "already" in response.json()["detail"].lower()


def test_update_owner_without_auth(client, sample_owner_data):
    """Testa que atualizar owner sem autenticação retorna 403"""
    update_data = {"name": "Teste"}
    response = client.put("/integrations/owner/test-id", json=update_data)
    assert response.status_code == 403

