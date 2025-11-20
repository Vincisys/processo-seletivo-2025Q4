# EyesOnAsset Challenge

Sistema de gerenciamento de ativos desenvolvido com React, TypeScript e FastAPI.

## Sobre o Projeto

O **EyesOnAsset** é uma aplicação full-stack para gerenciamento de ativos e seus responsáveis. O sistema permite cadastrar, listar, editar e excluir ativos e responsáveis, com autenticação baseada em JWT e interface moderna construída com React.

### Tecnologias Principais

- **Frontend**: React 18 + TypeScript + TanStack Router + TailwindCSS + shadcn/ui
- **Backend**: FastAPI + Python 3.9 + SQLAlchemy + SQLite
- **Autenticação**: JWT (JSON Web Tokens)
- **Containerização**: Docker + Docker Compose
- **Gerenciamento de Pacotes**: PNPM (monorepo)

> [!NOTE]
> Testes do Frontend: Os testes do frontend não foram implementados. O foco atual está na funcionalidade e testes do backend.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18 ou superior)
- **PNPM** (v10.22.0 ou superior) - [Como instalar](https://pnpm.io/installation)
- **Docker** e **Docker Compose** (para rodar via containers)
- **Python 3.9+** (apenas se for rodar o backend localmente sem Docker)

## Configuração de Variáveis de Ambiente

Antes de executar o projeto, é necessário configurar as variáveis de ambiente do frontend.

### Frontend

Crie um arquivo `.env` na pasta `apps/web/` com o seguinte conteúdo:

```env
VITE_API_URL=http://localhost:8000
```

**Importante**: Este arquivo é necessário para que o frontend consiga se comunicar com a API do backend. Sem ele, as requisições não funcionarão corretamente.

## Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd eyesonasset-challenge
```

## Como Executar

### Opção 1: Docker (Recomendado)

A forma mais simples de rodar o projeto completo:

```bash
# Build das imagens Docker
pnpm docker:build

# Iniciar os containers (backend + frontend)
pnpm docker:up
```

O sistema estará disponível em:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **Documentação da API (Swagger)**: http://localhost:8000/docs

### Opção 2: Desenvolvimento Local

#### Backend em Docker + Frontend Local

```bash
# Inicia o backend no Docker e Front-End em dev localmente para Hot-Reload
pnpm dev:fe
```

O frontend rodará em modo desenvolvimento em http://localhost:3001

#### Tudo Localmente

```bash
# Terminal 1 - Backend
cd apps/eyeson-back
pnpm build:project
pnpm dev
```

## Autenticação

O sistema possui autenticação baseada em JWT. Por padrão, um usuário inicial é criado automaticamente:

- **Login**: `eyesonasset`
- **Senha**: `eyesonasset`

### Criar Novos Usuários

Você pode criar novos usuários através da API:

```bash
curl -X POST http://localhost:8000/integrations/user/ \
  -H "Content-Type: application/json" \
  -d '{
    "login": "novousuario",
    "password": "senha123"
  }'
```

Ou através do Swagger em http://localhost:8000/docs

## Estrutura do Projeto

```
eyesonasset-challenge/
├── apps/
│   ├── web/                    # Frontend (React + TypeScript)
│   │   ├── src/
│   │   │   ├── components/     # Componentes reutilizáveis
│   │   │   ├── features/       # Features organizadas por domínio
│   │   │   │   ├── app/        # Features da aplicação (assets, owners)
│   │   │   │   └── auth/       # Autenticação
│   │   │   ├── routes/         # Rotas da aplicação
│   │   │   └── middlewares/    # Middlewares (auth, etc)
│   │   └── public/             # Arquivos estáticos
│   │
│   └── eyeson-back/            # Backend (FastAPI + Python)
│       ├── app/
│       │   ├── domain/         # Lógica de domínio
│       │   │   ├── assets/     # Módulo de ativos
│       │   │   ├── owners/     # Módulo de responsáveis
│       │   │   ├── users/      # Módulo de usuários
│       │   │   └── auth/      # Autenticação
│       │   ├── infrastructure/ # Infraestrutura (DB, seed)
│       │   └── main.py        # Entry point da API
│       ├── tests/              # Testes automatizados
│       └── requirements.txt   # Dependências Python
│
├── docker-compose.yml          # Configuração Docker
└── package.json               # Scripts do monorepo
```

## Scripts Disponíveis

### Scripts Principais

| Comando              | Descrição                                          |
| -------------------- | -------------------------------------------------- |
| `pnpm build:project` | Instala todas as dependências (frontend + backend) |
| `pnpm dev`           | Inicia frontend e backend em modo desenvolvimento  |
| `pnpm dev:fe`        | Backend no Docker + Frontend local                 |

### Scripts Docker

| Comando             | Descrição                                     |
| ------------------- | --------------------------------------------- |
| `pnpm docker:build` | Build das imagens Docker (frontend + backend) |
| `pnpm docker:up`    | Inicia os containers em modo detached         |
| `pnpm docker:test`  | Executa os testes Python dentro do container  |

### Scripts de Teste

| Comando     | Descrição                    |
| ----------- | ---------------------------- |
| `pnpm test` | Executa os testes do backend |

## Docker

O projeto possui configuração completa de Docker para facilitar o desenvolvimento e deploy.

### Serviços Disponíveis

- **backend**: API FastAPI na porta 8000
- **frontend**: Aplicação React servida via Nginx na porta 3001
- **test**: Container para executar testes Python

### Comandos Úteis

```bash
# Ver logs do backend
docker logs eyeson-backend

# Ver logs do frontend
docker logs eyeson-frontend

# Parar todos os containers
docker compose down

# Rebuild forçado
docker compose build --no-cache
```

## Testes

### Backend

Os testes do backend estão implementados usando pytest:

```bash
# Rodar testes localmente
cd apps/eyeson-back
pnpm test

# Rodar testes no Docker
pnpm docker:test
```

### Frontend

> [!NOTE]
> Testes do Frontend: Os testes do frontend não foram implementados. O foco atual está na funcionalidade e testes do backend.

## Documentação da API

A documentação interativa da API está disponível através do Swagger UI:

- **URL**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Principais Endpoints

#### Autenticação

- `POST /integrations/auth` - Login e obtenção de token JWT
- `POST /integrations/user/` - Cadastro de novos usuários

#### Responsáveis (Owners)

- `GET /integrations/owner` - Listar todos os responsáveis
- `POST /integrations/owner` - Criar responsável
- `GET /integrations/owner/{id}` - Buscar responsável por ID
- `PUT /integrations/owner/{id}` - Atualizar responsável
- `DELETE /integrations/owner/{id}` - Excluir responsável

#### Ativos (Assets)

- `GET /integrations/asset` - Listar todos os ativos
- `POST /integrations/asset` - Criar ativo
- `GET /integrations/asset/{id}` - Buscar ativo por ID
- `PUT /integrations/asset/{id}` - Atualizar ativo
- `DELETE /integrations/asset/{id}` - Excluir ativo

**Nota**: Todos os endpoints (exceto login e cadastro de usuário) requerem autenticação via token JWT.

## Configuração

### Variáveis de Ambiente

**Frontend**: A configuração do arquivo `.env` do frontend já foi explicada na seção [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente) no início deste documento.

**Backend**: O backend utiliza variáveis de ambiente para configuração. Crie um arquivo `.env` em `apps/eyeson-back/` se necessário:

```env
# Exemplo (valores padrão já configurados)
DATABASE_URL=sqlite:///./data/app.db
SECRET_KEY=eyesonasset-secret
```

### Banco de Dados

O projeto utiliza SQLite por padrão. O arquivo do banco é criado automaticamente em `apps/eyeson-back/data/app.db` na primeira execução.

O seed automático cria um usuário inicial:

- Login: `eyesonasset`
- Senha: `eyesonasset`

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Convenções de Commit

O projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `refactor:` - Refatoração de código
- `test:` - Adição ou correção de testes
- `docs:` - Documentação
- `chore:` - Tarefas de manutenção

## Troubleshooting

### Backend não inicia

- Verifique se a porta 8000 está livre
- Verifique os logs: `docker logs eyeson-backend`
- Certifique-se de que as dependências Python estão instaladas

### Frontend não carrega

- Verifique se a porta 3001 está livre
- Verifique se o backend está rodando
- Limpe o cache: `rm -rf node_modules && pnpm install`

### Erro de autenticação

- Verifique se o usuário padrão foi criado (veja logs do backend)
- Tente criar um novo usuário via API
- Verifique se o token JWT está sendo enviado corretamente

## Licença

Este projeto é parte de um desafio técnico.

## Links Úteis

- [Documentação do FastAPI](https://fastapi.tiangolo.com/)
- [Documentação do React](https://react.dev/)
- [Documentação do TanStack Router](https://tanstack.com/router)
- [Documentação do TailwindCSS](https://tailwindcss.com/)
- [Documentação do shadcn/ui](https://ui.shadcn.com/)

---

**Desenvolvido para o EyesOnAsset Challenge**
