"""
Testes para os endpoints de usuários
"""
import pytest
from app.schemas.user import UserCreate
from app.services.user_service import UserService


class TestUserAPI:
    """Testes para os endpoints de usuários"""
    
    def test_create_user_success(self, client, auth_headers):
        """Testa criação de usuário via API"""
        response = client.post(
            "/integrations/user",
            json={
                "username": "newuser",
                "password": "senha123"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["username"] == "newuser"
        assert "id" in data
        assert "password" not in data
        assert "hashed_password" not in data
    
    def test_create_user_duplicate_username(self, client, auth_headers, db_session):
        """Testa que não pode criar usuário com username duplicado"""
        # Criar primeiro usuário
        user_data = UserCreate(username="duplicate", password="senha123")
        UserService.create_user(db_session, user_data)
        
        # Tentar criar novamente
        response = client.post(
            "/integrations/user",
            json={
                "username": "duplicate",
                "password": "senha456"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 400
        assert "já está em uso" in response.json()["detail"]
    
    def test_create_user_validation_error(self, client, auth_headers):
        """Testa validação de dados na criação"""
        # Username muito curto
        response = client.post(
            "/integrations/user",
            json={
                "username": "ab",
                "password": "senha123"
            },
            headers=auth_headers
        )
        
        assert response.status_code == 422
    
    def test_create_user_unauthorized(self, client):
        """Testa que criação requer autenticação"""
        response = client.post(
            "/integrations/user",
            json={
                "username": "newuser",
                "password": "senha123"
            }
        )
        
        assert response.status_code == 403
    
    def test_get_user_success(self, client, auth_headers, db_session):
        """Testa busca de usuário por ID"""
        # Criar usuário
        user_data = UserCreate(username="getuser", password="senha123")
        user = UserService.create_user(db_session, user_data)
        
        # Buscar
        response = client.get(
            f"/integrations/user/{user.id}",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(user.id)
        assert data["username"] == "getuser"
        assert "password" not in data
        assert "hashed_password" not in data
    
    def test_get_user_not_found(self, client, auth_headers):
        """Testa busca de usuário inexistente"""
        response = client.get(
            "/integrations/user/00000000-0000-0000-0000-000000000000",
            headers=auth_headers
        )
        
        assert response.status_code == 404
    
    def test_get_user_unauthorized(self, client, db_session):
        """Testa que busca requer autenticação"""
        user_data = UserCreate(username="authtest", password="senha123")
        user = UserService.create_user(db_session, user_data)
        
        response = client.get(f"/integrations/user/{user.id}")
        
        assert response.status_code == 403
    
    def test_list_users_success(self, client, auth_headers, db_session):
        """Testa listagem de usuários"""
        # Criar múltiplos usuários
        for i in range(5):
            user_data = UserCreate(username=f"listuser{i}", password="senha123")
            UserService.create_user(db_session, user_data)
        
        response = client.get(
            "/integrations/users",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 5  # Pelo menos os 5 criados (pode ter o user padrão)
    
    def test_list_users_pagination(self, client, auth_headers, db_session):
        """Testa paginação da listagem"""
        # Criar vários usuários
        for i in range(10):
            user_data = UserCreate(username=f"pageuser{i}", password="senha123")
            UserService.create_user(db_session, user_data)
        
        # Buscar primeira página
        response = client.get(
            "/integrations/users?skip=0&limit=5",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 5
    
    def test_list_users_unauthorized(self, client):
        """Testa que listagem requer autenticação"""
        response = client.get("/integrations/users")
        
        assert response.status_code == 403
    
    def test_update_user_username(self, client, auth_headers, db_session):
        """Testa atualização de username"""
        # Criar usuário
        user_data = UserCreate(username="oldname", password="senha123")
        user = UserService.create_user(db_session, user_data)
        
        # Atualizar
        response = client.put(
            f"/integrations/user/{user.id}",
            json={"username": "newname"},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "newname"
    
    def test_update_user_password(self, client, auth_headers, db_session):
        """Testa atualização de senha"""
        # Criar usuário
        user_data = UserCreate(username="passuser", password="senha123")
        user = UserService.create_user(db_session, user_data)
        
        # Atualizar senha
        response = client.put(
            f"/integrations/user/{user.id}",
            json={"password": "novasenha"},
            headers=auth_headers
        )
        
        assert response.status_code == 200
        
        # Verificar que nova senha funciona
        authenticated = UserService.authenticate_user(db_session, "passuser", "novasenha")
        assert authenticated is not None
    
    def test_update_user_not_found(self, client, auth_headers):
        """Testa atualização de usuário inexistente"""
        response = client.put(
            "/integrations/user/00000000-0000-0000-0000-000000000000",
            json={"username": "newname"},
            headers=auth_headers
        )
        
        assert response.status_code == 404
    
    def test_update_user_duplicate_username(self, client, auth_headers, db_session):
        """Testa que não pode atualizar para username já existente"""
        user_data1 = UserCreate(username="user1", password="senha123")
        user_data2 = UserCreate(username="user2", password="senha123")
        
        UserService.create_user(db_session, user_data1)
        user2 = UserService.create_user(db_session, user_data2)
        
        response = client.put(
            f"/integrations/user/{user2.id}",
            json={"username": "user1"},
            headers=auth_headers
        )
        
        assert response.status_code == 400
        assert "já está em uso" in response.json()["detail"]
    
    def test_update_user_unauthorized(self, client, db_session):
        """Testa que atualização requer autenticação"""
        user_data = UserCreate(username="authtest2", password="senha123")
        user = UserService.create_user(db_session, user_data)
        
        response = client.put(
            f"/integrations/user/{user.id}",
            json={"username": "newname"}
        )
        
        assert response.status_code == 403
    
    def test_delete_user_success(self, client, auth_headers, db_session):
        """Testa deleção de usuário"""
        # Criar usuário
        user_data = UserCreate(username="deleteuser", password="senha123")
        user = UserService.create_user(db_session, user_data)
        
        # Deletar
        response = client.delete(
            f"/integrations/user/{user.id}",
            headers=auth_headers
        )
        
        assert response.status_code == 204
        
        # Verificar que foi deletado
        assert UserService.get_user(db_session, user.id) is None
    
    def test_delete_user_not_found(self, client, auth_headers):
        """Testa deleção de usuário inexistente"""
        response = client.delete(
            "/integrations/user/00000000-0000-0000-0000-000000000000",
            headers=auth_headers
        )
        
        assert response.status_code == 404
    
    def test_delete_user_unauthorized(self, client, db_session):
        """Testa que deleção requer autenticação"""
        user_data = UserCreate(username="authtest3", password="senha123")
        user = UserService.create_user(db_session, user_data)
        
        response = client.delete(f"/integrations/user/{user.id}")
        
        assert response.status_code == 403
