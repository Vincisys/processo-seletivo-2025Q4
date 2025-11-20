import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.infrastructure.database import Base, get_db
from app.domain.owners.models import Owner
from app.domain.assets.models import Asset
from app.domain.users.models import User
from app.infrastructure.seed import seed_initial_user


@pytest.fixture(scope="function")
def test_db():
    # Usar arquivo temporário em vez de :memory: para garantir que todas as conexões vejam o mesmo banco
    import tempfile
    import os
    db_fd, db_path = tempfile.mkstemp(suffix='.db')
    os.close(db_fd)
    
    engine = create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})
    yield engine
    
    Base.metadata.drop_all(bind=engine)
    os.unlink(db_path)  # Remove o arquivo temporário


@pytest.fixture(scope="function")
def db_session(test_db):
    # Garantir que as tabelas existem antes de criar a sessão
    Base.metadata.create_all(bind=test_db)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_db)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="function")
def client(test_db):
    # Importar modelos primeiro para garantir que estejam registrados
    from app.domain.owners.models import Owner
    from app.domain.assets.models import Asset
    from app.domain.users.models import User
    
    # Importar o app (ele tentará criar no engine de produção, mas não importa)
    from app.main import app
    
    # Criar as tabelas no banco de teste DEPOIS de importar tudo
    Base.metadata.create_all(bind=test_db)
    
    # Criar usuário inicial para os testes
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_db)
    session = SessionLocal()
    try:
        seed_initial_user(session)
    finally:
        session.close()
    
    def override_get_db():
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_db)
        session = SessionLocal()
        try:
            yield session
        finally:
            session.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def sample_owner_data():
    return {
        "name": "João Silva",
        "email": "joao@example.com",
        "phone": "74981242242"
    }


@pytest.fixture
def sample_owner(db_session, sample_owner_data):
    owner = Owner(
        id="test-owner-id-1",
        name=sample_owner_data["name"],
        email=sample_owner_data["email"],
        phone=sample_owner_data["phone"]
    )
    db_session.add(owner)
    db_session.commit()
    db_session.refresh(owner)
    return owner


@pytest.fixture
def sample_asset_data(sample_owner):
    return {
        "name": "Notebook Dell",
        "category": "Eletrônicos",
        "owner_id": sample_owner.id
    }


@pytest.fixture
def sample_asset(db_session, sample_asset_data):
    asset = Asset(
        id="test-asset-id-1",
        name=sample_asset_data["name"],
        category=sample_asset_data["category"],
        owner_id=sample_asset_data["owner_id"]
    )
    db_session.add(asset)
    db_session.commit()
    db_session.refresh(asset)
    return asset


@pytest.fixture
def auth_token(client):
    """Fixture que retorna um token de autenticação válido"""
    login_data = {
        "login": "eyesonasset",
        "password": "eyesonasset"
    }
    response = client.post("/integrations/auth", json=login_data)
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture
def authenticated_client(client, auth_token, test_db):
    """Fixture que retorna um cliente autenticado"""
    from fastapi.testclient import TestClient
    from app.main import app
    from app.infrastructure.database import get_db
    from sqlalchemy.orm import sessionmaker
    
    # Garante que as tabelas existem
    Base.metadata.create_all(bind=test_db)
    
    # Cria o override de get_db igual ao client original
    def override_get_db():
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_db)
        session = SessionLocal()
        try:
            yield session
        finally:
            session.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    # Cria um novo cliente com o header de autenticação
    test_client = TestClient(app)
    test_client.headers.update({"Authorization": f"Bearer {auth_token}"})
    
    yield test_client
    
    # Limpa os overrides
    app.dependency_overrides.clear()

