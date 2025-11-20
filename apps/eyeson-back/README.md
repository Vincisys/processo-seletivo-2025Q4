# Eyeson Backend API

API desenvolvida com FastAPI e SQLAlchemy usando SQLite.

## Requisitos

- Python 3.11+
- Docker e Docker Compose (opcional)

## Instalação Local

1. Crie um ambiente virtual:

```bash
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
```

2. Instale as dependências:

```bash
pip install -r requirements.txt
```

3. Execute a aplicação:

```bash
uvicorn app.main:app --reload
```

A API estará disponível em `http://localhost:8000`

## Documentação

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Docker

Para executar com Docker Compose:

```bash
docker-compose up --build
```

## Testes

### Executar Testes Localmente

```bash
# Executar todos os testes
pytest

# Executar com verbose
pytest -v

# Executar testes específicos
pytest tests/domain/owners/test_owner_service.py

# Executar com cobertura
pytest --cov=app --cov-report=html

# Executar com cobertura e ver relatório no terminal
pytest --cov=app --cov-report=term-missing
```

### Executar Testes com Docker

```bash
# Executar todos os testes no container
docker-compose run --rm test

# Executar testes com verbose
docker-compose run --rm test pytest -v

# Executar testes específicos
docker-compose run --rm test pytest tests/domain/owners/test_owner_service.py

# Executar com cobertura
docker-compose run --rm test pytest --cov=app --cov-report=html

# Executar com cobertura e ver relatório no terminal
docker-compose run --rm test pytest --cov=app --cov-report=term-missing

# Executar testes e copiar relatório HTML para o host
docker-compose run --rm test pytest --cov=app --cov-report=html
docker cp eyeson-back-test:/app/htmlcov ./htmlcov

# Usar script auxiliar (mais simples)
./test.sh                    # Executa todos os testes
./test.sh --coverage          # Executa com cobertura
./test.sh --verbose           # Executa com verbose
./test.sh -v tests/domain/owners/test_owner_service.py  # Executa teste específico
```

**Nota:** O serviço `test` usa o profile `test` do docker-compose, então não interfere com o serviço `api` em execução.

### Cobertura de Testes

A cobertura de testes está configurada para exigir no mínimo 80% de cobertura. Para ver o relatório completo:

```bash
# Gerar relatório HTML
pytest --cov=app --cov-report=html

# Abrir relatório no navegador (macOS)
open htmlcov/index.html

# Abrir relatório no navegador (Linux)
xdg-open htmlcov/index.html
```

O relatório HTML será gerado na pasta `htmlcov/` e mostra detalhadamente quais linhas estão cobertas pelos testes.

## Estrutura do Projeto

```
eyeson-back/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Aplicação FastAPI principal
│   ├── domain/                    # Domínios da aplicação
│   │   ├── owners/               # Módulo de owners
│   │   │   ├── models/           # Modelos SQLAlchemy
│   │   │   ├── schemas/          # Schemas Pydantic
│   │   │   ├── repository.py     # Camada de acesso a dados
│   │   │   ├── service.py        # Lógica de negócio
│   │   │   └── owner_controller.py # Rotas HTTP
│   │   └── assets/               # Módulo de assets
│   ├── infrastructure/            # Infraestrutura
│   │   └── database.py           # Configuração SQLAlchemy
│   └── shared/                    # Código compartilhado
│       └── types.py              # Tipos customizados
├── tests/                         # Testes unitários
│   ├── conftest.py               # Fixtures compartilhadas
│   └── domain/
│       ├── owners/               # Testes de owners
│       └── assets/               # Testes de assets
├── requirements.txt
├── pytest.ini                    # Configuração do pytest
├── .coveragerc                   # Configuração de cobertura
├── Dockerfile
└── docker-compose.yml
```
