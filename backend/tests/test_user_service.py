"""
Testes unitários para o UserService
"""
import pytest
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserUpdate


class TestUserService:
    """Testes para o UserService"""
    
    def test_create_user(self, db_session):
        """Testa criação de usuário via service"""
        user_data = UserCreate(
            username="testuser",
            password="senha123"
        )
        
        user = UserService.create_user(db_session, user_data)
        
        assert user.id is not None
        assert user.username == "testuser"
        assert user.hashed_password is not None
        assert user.hashed_password != "senha123"  # Senha deve estar com hash
    
    def test_create_user_duplicate_username(self, db_session):
        """Testa que username duplicado gera erro"""
        user_data1 = UserCreate(
            username="sameuser",
            password="senha123"
        )
        user_data2 = UserCreate(
            username="sameuser",
            password="outrasenha"
        )
        
        UserService.create_user(db_session, user_data1)
        
        with pytest.raises(ValueError, match="já está em uso"):
            UserService.create_user(db_session, user_data2)
    
    def test_authenticate_user_success(self, db_session):
        """Testa autenticação com credenciais corretas"""
        # Criar usuário
        user_data = UserCreate(
            username="authuser",
            password="senha123"
        )
        created_user = UserService.create_user(db_session, user_data)
        
        # Autenticar
        authenticated = UserService.authenticate_user(db_session, "authuser", "senha123")
        
        assert authenticated is not None
        assert authenticated.id == created_user.id
        assert authenticated.username == "authuser"
    
    def test_authenticate_user_wrong_password(self, db_session):
        """Testa autenticação com senha incorreta"""
        # Criar usuário
        user_data = UserCreate(
            username="authuser2",
            password="senha123"
        )
        UserService.create_user(db_session, user_data)
        
        # Tentar autenticar com senha errada
        authenticated = UserService.authenticate_user(db_session, "authuser2", "senhaerrada")
        
        assert authenticated is None
    
    def test_authenticate_user_not_found(self, db_session):
        """Testa autenticação com usuário inexistente"""
        authenticated = UserService.authenticate_user(db_session, "naoexiste", "senha123")
        
        assert authenticated is None
    
    def test_get_user(self, db_session):
        """Testa busca de usuário por ID"""
        user_data = UserCreate(
            username="getuser",
            password="senha123"
        )
        created = UserService.create_user(db_session, user_data)
        
        found = UserService.get_user(db_session, created.id)
        
        assert found is not None
        assert found.id == created.id
        assert found.username == "getuser"
    
    def test_get_user_not_found(self, db_session):
        """Testa busca de usuário inexistente"""
        found = UserService.get_user(db_session, "00000000-0000-0000-0000-000000000000")
        
        assert found is None
    
    def test_get_user_by_username(self, db_session):
        """Testa busca de usuário por username"""
        user_data = UserCreate(
            username="findme",
            password="senha123"
        )
        created = UserService.create_user(db_session, user_data)
        
        found = UserService.get_user_by_username(db_session, "findme")
        
        assert found is not None
        assert found.id == created.id
        assert found.username == "findme"
    
    def test_get_users_list(self, db_session):
        """Testa listagem de usuários"""
        # Criar múltiplos usuários (além do usuário padrão já criado pelo fixture)
        for i in range(5):
            user_data = UserCreate(
                username=f"user{i}",
                password="senha123"
            )
            UserService.create_user(db_session, user_data)
        
        users = UserService.get_users(db_session)
        
        # Deve ter 6 usuários: 1 padrão (eyesonasset) + 5 criados
        assert len(users) == 6
    
    def test_get_users_pagination(self, db_session):
        """Testa paginação de usuários"""
        # Criar 10 usuários
        for i in range(10):
            user_data = UserCreate(
                username=f"pageuser{i}",
                password="senha123"
            )
            UserService.create_user(db_session, user_data)
        
        # Buscar com paginação
        page1 = UserService.get_users(db_session, skip=0, limit=5)
        page2 = UserService.get_users(db_session, skip=5, limit=5)
        
        assert len(page1) == 5
        assert len(page2) == 5
        assert page1[0].id != page2[0].id
    
    def test_update_user_username(self, db_session):
        """Testa atualização de username"""
        user_data = UserCreate(
            username="oldname",
            password="senha123"
        )
        created = UserService.create_user(db_session, user_data)
        
        update_data = UserUpdate(username="newname")
        updated = UserService.update_user(db_session, created.id, update_data)
        
        assert updated is not None
        assert updated.username == "newname"
    
    def test_update_user_password(self, db_session):
        """Testa atualização de senha"""
        user_data = UserCreate(
            username="passuser",
            password="senha123"
        )
        created = UserService.create_user(db_session, user_data)
        old_hash = created.hashed_password
        
        update_data = UserUpdate(password="novasenha")
        updated = UserService.update_user(db_session, created.id, update_data)
        
        assert updated is not None
        assert updated.hashed_password != old_hash
        
        # Verificar que nova senha funciona
        authenticated = UserService.authenticate_user(db_session, "passuser", "novasenha")
        assert authenticated is not None
    
    def test_update_user_duplicate_username(self, db_session):
        """Testa que não pode atualizar para username já existente"""
        user_data1 = UserCreate(username="user1", password="senha123")
        user_data2 = UserCreate(username="user2", password="senha123")
        
        UserService.create_user(db_session, user_data1)
        user2 = UserService.create_user(db_session, user_data2)
        
        update_data = UserUpdate(username="user1")
        
        with pytest.raises(ValueError, match="já está em uso"):
            UserService.update_user(db_session, user2.id, update_data)
    
    def test_update_user_not_found(self, db_session):
        """Testa atualização de usuário inexistente"""
        update_data = UserUpdate(username="newname")
        updated = UserService.update_user(
            db_session, 
            "00000000-0000-0000-0000-000000000000", 
            update_data
        )
        
        assert updated is None
    
    def test_delete_user(self, db_session):
        """Testa deleção de usuário"""
        user_data = UserCreate(
            username="deleteuser",
            password="senha123"
        )
        created = UserService.create_user(db_session, user_data)
        
        result = UserService.delete_user(db_session, created.id)
        
        assert result is True
        assert UserService.get_user(db_session, created.id) is None
    
    def test_delete_user_not_found(self, db_session):
        """Testa deleção de usuário inexistente"""
        result = UserService.delete_user(db_session, "00000000-0000-0000-0000-000000000000")
        
        assert result is False
