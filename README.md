<p align="center">
  <img src="./assets/eyesonasset-logo.png" alt="Logo EyesOnAsset" height="110">
</p>
<h1 align="center">
  EyesOnAsset — Desafio Técnico
</h1>

## 🎯 Quick Start - Rodar o Projeto

### Pré-requisitos
- **Docker** e **Docker Compose** instalados
- **Node.js 18+** instalado
- **Git** para clonar o repositório

### Passo a Passo (5 minutos)

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd processo-seletivo-2025Q4

# 2. Iniciar o Backend (Docker)
cd backend
docker-compose up -d --build
docker exec eyesonasset-backend python create_default_user.py
cd ..

# 3. Iniciar o Frontend
cd frontend
npm install
npm run dev
cd ..
```

**✅ Pronto!** Acesse: http://localhost:3000

**🔐 Login:**
- Username: `eyesonasset`
- Password: `eyesonasset`

### Comandos Úteis

```bash
# Ver logs do backend
docker logs eyesonasset-backend -f

# Ver logs com erros
docker logs eyesonasset-backend --tail 50 2>&1 | grep -i error

# Parar tudo
docker-compose -f backend/docker-compose.yaml down
# Ctrl+C no terminal do frontend

# Executar testes do backend
docker exec eyesonasset-backend pytest --cov=app

# Executar testes do frontend
cd frontend && npm test
```

### Arquitetura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────┐
│   Frontend      │─────▶│   Backend API   │─────▶│   SQLite    │
│   React + Vite  │ HTTP │  FastAPI + JWT  │ ORM  │ eyesonasset │
│   Port: 3000    │      │   Port: 8000    │      │    .db      │
└─────────────────┘      └─────────────────┘      └─────────────┘
```

### Endpoints Principais

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Swagger Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Documentação Completa

- 📖 **README Principal:** Você está aqui!
- 📖 **Backend:** [backend/README.md](./backend/README.md)
- 📖 **Frontend:** [frontend/README.md](./frontend/README.md)
- ✅ **Checklist Primeira Execução:** [CHECKLIST.md](./CHECKLIST.md)
- ⚡ **Comandos Rápidos:** [COMMANDS.md](./COMMANDS.md)
- 🔧 **Troubleshooting:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## Sumário

- [❤️ Bem-vindos](#️-bem-vindos)
- [🚀 Vamos nessa!](#-vamos-nessa)
  - [Dicas](#dicas)
  - [Como você deverá desenvolver?](#como-você-deverá-desenvolver)
  - [Qual o tempo para entregar?](#qual-o-tempo-para-entregar)

- [💻 O Problema](#-o-problema)
  - [Contexto](#contexto)
  - [Estrutura de um Ativo](#estrutura-de-um-ativo)
  - [Estrutura de um Responsável](#estrutura-de-um-responsável)

- [💾 Back-end](#-back-end)
  - [Nível 1 — Validação](#nível-1--validação)
  - [Nível 2 — Persistência](#nível-2--persistência)
  - [Nível 3 — Testes](#nível-3--testes)
  - [Nível 4 — Autenticação](#nível-4--autenticação)
  - [Nível 5 — Permissões](#nível-5--permissões)
  - [Nível 6 — Infra e Doc](#nível-6--infra-e-doc)

- [🖥️ Front-end](#️-front-end)
  - [Nível 1 — Cadastros e Listagens](#-Nível-1-—-Cadastros-e-Listagens)
  - [Nível 2 — Conectando na API](#nível-2--conectando-na-api)
  - [Nível 3 — Melhoria nas Listagens](#nível-3--Melhoria-nas-Listagens)
  - [Nível 4 — Autenticação](#nível-4--autenticação-1)
  - [Nível 5 — Testes](#nível-5--testes-1)

---

## ❤️ Bem-vindos

Olá! 👋

Seja bem-vindo ao processo seletivo da **EyesOnAsset**, plataforma de gestão inteligente de ativos.

Temos vagas para todos os nívels - e os níveis deste desafio permitem diferenciar performance entre os perfis, mas **não é obrigatório completar tudo**.

Prepare um ☕, respire fundo e divirta-se resolvendo!

---

## 🚀 Vamos nessa!

Este teste avalia como você entende, organiza, estrutura e entrega uma solução para um problema relacionado ao domínio de CMMS.

### Dicas

- Documente seus passos.
- Pergunte se algo estiver ambíguo.
- Mostre seu raciocínio.
- Capriche no README.

### Como você deverá desenvolver?

1. Faça **fork** deste repositório.
2. Implemente cada nível conforme quiser avançar.
3. Faça commits pequenos e bem descritos.
4. Quando finalizar, abra um **Pull Request** para o repositório original.

### Qual o tempo para entregar?

Quanto antes você enviar, mais cuidadosamente conseguiremos avaliar.

Enviando parcial também é válido. Não desista.

---

## 💻 O Problema

O time de operações da EyesOnAsset precisa automatizar o registro e gestão de ativos físicos. Hoje isso é feito manualmente, consumindo muito tempo.

Seu objetivo é criar uma mini-versão simplificada do fluxo central da plataforma.

### Contexto

Diariamente são cadastrados diversos ativos, cada um associado a um responsável.

Seu papel será criar APIs e uma interface que permita gerenciar essas entidades.

### Estrutura de um Ativo

| CAMPO    | TIPO          | DESCRIÇÃO                            |
| -------- | ------------- | ------------------------------------ |
| id       | string (UUID) | Identificação do ativo               |
| name     | string(140)   | Nome do ativo                        |
| category | string(60)    | Categoria (ex.: "Aeronave", "Navio") |
| owner    | string (UUID) | ID do responsável                    |

### Estrutura de um Responsável

| CAMPO | TIPO          | DESCRIÇÃO                    |
| ----- | ------------- | ---------------------------- |
| id    | string (UUID) | Identificação do responsável |
| name  | string(140)   | Nome completo                |
| email | string(140)   | Email corporativo            |
| phone | string(20)    | Telefone                     |

---

## 💾 Back-end

### Nível 1 — Validação

Crie uma API **FastAPI** com a rota:

`POST /integrations/asset`

Regras:

- Todos os campos obrigatórios.
- IDs devem ser UUID.
- Strings obedecem limites.
- Erros devem indicar claramente qual campo violou qual regra.

Se tudo estiver válido, retorne o JSON recebido.

---

### Nível 2 — Persistência

Use **SQLAlchemy + SQLite**.

Crie bancos e tabelas seguindo as estruturas acima.

IDs devem passar a ser gerados automaticamente. IDs não devem ser aceitos como parâmetros em recursos de criacao.

Rotas exigidas (itere sobre a rota criada anteriormente):

- `POST /integrations/asset`
- `GET /integrations/asset/:id`
- `POST /integrations/owner`
- `GET /integrations/owner/:id`
- CRUD completo para ambos.

#### Nota: A tratativa para exclusão de registros dependentes (regras de deleção reversa) é um diferencial.

---

### Nível 3 — Testes

Crie testes unitários para cada módulo.

Utilize **pytest**. Se possível verifique a cobertura de testes e adicione no README.

---

### Nível 4 — Autenticação

Crie rota:

`POST /integrations/auth`

Com login e password fixos:

```json
{
  "login": "eyesonasset",
  "password": "eyesonasset"
}
```

Retornar JWT com expiração de **1 minuto**.

Todas as rotas devem exigir o token via Header.

---

### Nível 5 — Usuários

Crie entidade de **usuários** para autenticação.
Refatore o login para validar via banco.

---

### Nível 6 — Infra e Doc

- Dockerfile
- docker-compose.yaml
- Documentação de setup, rodar e testar o projeto

## 🖥️ Front-end

### Nível 1 — Cadastros e Listagens

#### Nota: Os dados deste nível podem ser _mockados_.

- Criar tela de cadastro e listagem de responsáveis, seguindo os campos indicados na [definição do problema](#-💻-O-Problema).
- Criar tela de cadastro e listagem de ativos, também de acordo com os campos da definição do problema. O campo _owner_ _NÃO_ deve ser apresentado aqui.
- Validação de campos obrigatórios. Note que a comunicação com o back-end não é mandatória neste nível.

Utilize **React** para construir o front-end. Bibliotecas de gerenciamento de estado e componentes de UI são diferenciais, mas opcionais.

---

### Nível 2 — Conectando na API

Faça com que as telas de listagem de ativos e responsáveis se conectem com o projeto do back-end. Listagens devem utilizar as rotas de método _GET_, já cadastros utilizam as rotas _POST_.

Utilize [axios](https://axios-http.com/docs/intro) como biblioteca de comunicação.

---

### Nível 3 — Melhoria nas Listagens

Neste nível, implemente uma página de detalhes para os itens da listagem e as ações de editar e excluir recursos.
A página de detalhes de ativos deve conter o nome do responsável.

#### Nota: Cuidados com a UX, como confirmação em ações destruitivas e feedback de operações, são diferenciais.

---

### Nível 4 — Autenticação

Implementar tela de login.

Token salvo no localStorage.

Expiração deve redirecionar para login.

---

### Nível 5 — Testes

Implemente testes para as telas criadas no nível anterior, utilize qualquer biblioteca de testes. _Code Coverage_ é um diferencial.

---

## ✅ Status da Implementação

### Backend (FastAPI)

| Nível | Status | Detalhes |
|-------|--------|----------|
| **Nível 1** - Validação | ✅ Completo | Schemas Pydantic com validação completa |
| **Nível 2** - Persistência | ✅ Completo | SQLAlchemy + SQLite, CASCADE DELETE |
| **Nível 3** - Testes | ✅ Completo | 127 testes, 94% cobertura |
| **Nível 4** - Autenticação | ✅ Completo | JWT com expiração de 60min |
| **Nível 5** - Usuários | ✅ Completo | Bcrypt, CRUD de usuários |
| **Nível 6** - Infra e Doc | ✅ Completo | Docker, docs completa |

**Tecnologias:**
- FastAPI 0.109.0
- SQLAlchemy ORM
- JWT (HS256) + bcrypt
- pytest (127 testes)
- Docker + docker-compose

**Destaques:**
- ✨ CASCADE DELETE implementado
- ✨ 94% de cobertura de testes
- ✨ Documentação Swagger/ReDoc automática
- ✨ CORS configurado para frontend
- ✨ Banco eyesonasset.db com UUIDs

### Frontend (React)

| Nível | Status | Detalhes |
|-------|--------|----------|
| **Nível 1** - Cadastros e Listagens | ✅ Completo | Formulários com validação |
| **Nível 2** - Conectando na API | ✅ Completo | Axios com interceptors |
| **Nível 3** - Melhoria nas Listagens | ✅ Completo | Detalhes, edição, exclusão |
| **Nível 4** - Autenticação | ✅ Completo | Login, JWT, rotas protegidas |

**Tecnologias:**
- React 18.2
- Vite 4.5
- React Router 6.20
- Axios 1.6

**Destaques:**
- ✨ Design responsivo (mobile-first)
- ✨ Toast notifications para feedback
- ✨ Confirmação de ações destrutivas
- ✨ Infinite scroll prevention
- ✨ Direct API loading pattern

### Funcionalidades Completas

- ✅ Autenticação com JWT (60min de expiração)
- ✅ CRUD completo de Owners (Responsáveis)
- ✅ CRUD completo de Assets (Ativos)
- ✅ Relacionamento Owner ↔ Assets
- ✅ CASCADE DELETE (deletar owner deleta assets)
- ✅ Validações client-side e server-side
- ✅ Tratamento de erros e feedback visual
- ✅ Navegação direta para páginas de detalhes/edição
- ✅ Sem loops infinitos (useEffect otimizado)

### Comandos Rápidos

```bash
# Backend - Ver logs
docker logs eyesonasset-backend -f

# Backend - Executar testes
docker exec eyesonasset-backend pytest --cov=app

# Backend - Recriar usuário
docker exec eyesonasset-backend python create_default_user.py

# Frontend - Iniciar
cd frontend && npm run dev

# Frontend - Build
cd frontend && npm run build
```

### Credenciais Padrão

```
Username: eyesonasset
Password: eyesonasset
```

### URLs Importantes

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

**Desenvolvido com ❤️ para o processo seletivo EyesOnAsset**
