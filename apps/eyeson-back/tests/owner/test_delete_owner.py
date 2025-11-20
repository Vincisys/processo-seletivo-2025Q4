import pytest


def test_delete_owner(authenticated_client, sample_owner_data):
    """Testa deletar um owner existente"""
    # Cria um owner
    created_owner = authenticated_client.post("/integrations/owner/", json=sample_owner_data).json()
    owner_id = created_owner["id"]
    
    # Verifica que o owner existe
    get_response = authenticated_client.get(f"/integrations/owner/{owner_id}")
    assert get_response.status_code == 200
    
    # Deleta o owner
    delete_response = authenticated_client.delete(f"/integrations/owner/{owner_id}")
    assert delete_response.status_code == 204
    
    # Verifica que o owner não existe mais no banco
    get_response_after = authenticated_client.get(f"/integrations/owner/{owner_id}")
    assert get_response_after.status_code == 404
    
    # Verifica que não está mais na lista de owners
    all_owners = authenticated_client.get("/integrations/owner/").json()
    owner_ids = [owner["id"] for owner in all_owners]
    assert owner_id not in owner_ids


def test_delete_owner_not_found(authenticated_client):
    """Testa deletar um owner que não existe"""
    response = authenticated_client.delete("/integrations/owner/non-existent-id")
    
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_delete_owner_removes_assets(authenticated_client, sample_owner, sample_asset_data):
    """Testa que deletar um owner também deleta seus assets (cascade delete)"""
    # Cria um asset para o owner
    asset = authenticated_client.post("/integrations/asset/", json=sample_asset_data).json()
    asset_id = asset["id"]
    
    # Verifica que o asset existe
    get_asset = authenticated_client.get(f"/integrations/asset/{asset_id}")
    assert get_asset.status_code == 200
    
    # Deleta o owner
    delete_response = authenticated_client.delete(f"/integrations/owner/{sample_owner.id}")
    assert delete_response.status_code == 204
    
    # Verifica que o asset foi deletado também (cascade delete)
    get_asset_after = authenticated_client.get(f"/integrations/asset/{asset_id}")
    assert get_asset_after.status_code == 404


def test_delete_owner_without_auth(client):
    """Testa que deletar owner sem autenticação retorna 403"""
    response = client.delete("/integrations/owner/test-id")
    assert response.status_code == 403

