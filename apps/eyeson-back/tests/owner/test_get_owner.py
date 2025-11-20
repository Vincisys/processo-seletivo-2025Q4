import pytest


def test_get_all_owners_empty(authenticated_client):
    """Testa listar todos os owners quando não há nenhum"""
    response = authenticated_client.get("/integrations/owner/")
    
    assert response.status_code == 200
    assert response.json() == []


def test_get_all_owners(authenticated_client, sample_owner_data):
    """Testa listar todos os owners criados"""
    # Cria alguns owners
    owner1 = authenticated_client.post("/integrations/owner/", json=sample_owner_data).json()
    
    owner2_data = {
        "name": "Maria Santos",
        "email": "maria@example.com",
        "phone": "11987654321"
    }
    owner2 = authenticated_client.post("/integrations/owner/", json=owner2_data).json()

    # Lista todos
    response = authenticated_client.get("/integrations/owner/")
    
    assert response.status_code == 200
    owners = response.json()
    assert len(owners) == 2
    
    # Verifica que os owners criados estão na lista
    owner_ids = [owner["id"] for owner in owners]
    assert owner1["id"] in owner_ids
    assert owner2["id"] in owner_ids


def test_get_owner_by_id(authenticated_client, sample_owner_data):
    """Testa buscar um owner específico por ID"""
    # Cria um owner
    created_owner = authenticated_client.post("/integrations/owner/", json=sample_owner_data).json()
    owner_id = created_owner["id"]
    
    # Busca o owner
    response = authenticated_client.get(f"/integrations/owner/{owner_id}")
    
    assert response.status_code == 200
    owner = response.json()
    assert owner["id"] == owner_id
    assert owner["name"] == sample_owner_data["name"]
    assert owner["email"] == sample_owner_data["email"]
    assert owner["phone"] == sample_owner_data["phone"]


def test_get_owner_not_found(authenticated_client):
    """Testa buscar um owner que não existe"""
    response = authenticated_client.get("/integrations/owner/non-existent-id")
    
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_owner_without_auth(client):
    """Testa que buscar owner sem autenticação retorna 403"""
    response = client.get("/integrations/owner/")
    assert response.status_code == 403

