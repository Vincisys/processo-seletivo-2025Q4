# EyesOnAsset - Frontend

Interface web para gestão de ativos físicos e seus responsáveis, desenvolvida com React e Vite.

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-4.5-646CFF?logo=vite)
![Router](https://img.shields.io/badge/React%20Router-6.20-CA4245?logo=react-router)
![Vitest](https://img.shields.io/badge/Vitest-1.0-6E9F18?logo=vitest)

## ✨ Features

### Nível 1 ✅
- ✅ **Cadastro de Responsáveis**: Formulário completo com validação
- ✅ **Cadastro de Ativos**: Gestão de ativos físicos
- ✅ **Listagem e Filtros**: Busca e filtros por categoria
- ✅ **Validação de Campos**: Validação completa de campos obrigatórios
- ✅ **Interface Responsiva**: Design moderno e mobile-friendly

### Nível 2 ✅
- ✅ **Integração com Backend**: Conexão completa com API REST
- ✅ **Requisições GET/POST/PUT/DELETE**: CRUD completo via Axios
- ✅ **Autenticação JWT**: Token armazenado no localStorage
- ✅ **Interceptors HTTP**: Tratamento automático de autenticação e erros

### Nível 3 ✅
- ✅ **Páginas de Detalhes**: Visualização completa de ativos e responsáveis
- ✅ **Nome do Responsável em Ativos**: Exibição do owner vinculado
- ✅ **Confirmação de Exclusão**: Dialog modal para ações destrutivas
- ✅ **Feedback de Operações**: Toast notifications para sucesso/erro
- ✅ **Estados de Loading**: Indicadores visuais em operações assíncronas

### Nível 4 ✅
- ✅ **Tela de Login**: Autenticação com validação
- ✅ **Tela de Registro**: Cadastro de novos usuários
- ✅ **Token no localStorage**: Persistência de sessão
- ✅ **Rotas Protegidas**: Redirecionamento automático para login
- ✅ **Tratamento de Expiração**: Logout automático em token inválido

## 🚀 Quick Start

### Pré-requisitos

- **Node.js 18+** (verifique com `node --version`)
- **Backend rodando** em http://localhost:8000 ([ver backend README](../backend/README.md))

### Instalação e Execução

```bash
# 1. Navegar para o diretório frontend
cd frontend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env se necessário (já vem configurado para localhost:8000)

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

**✅ Aplicação disponível em:** http://localhost:3000

**🔐 Credenciais padrão:**
- Username: `eyesonasset`
- Password: `eyesonasset`

### Build para Produção

```bash
# Build otimizado
npm run build

# Preview do build
npm run preview
```

## 📝 Comandos Essenciais

### Desenvolvimento

```bash
# Iniciar dev server com hot reload
npm run dev

# Iniciar em porta específica
npm run dev -- --port 3001

# Iniciar e abrir no navegador
npm run dev -- --open
```

### Qualidade de Código

```bash
# Verificar problemas de lint
npm run lint

# Corrigir problemas automaticamente
npm run lint -- --fix

# Formatar código
npm run format
```

### Gerenciamento de Dependências

```bash
# Instalar nova dependência
npm install <pacote>

# Instalar dependência de desenvolvimento
npm install -D <pacote>

# Atualizar dependências
npm update

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades automaticamente
npm audit fix
```

### Debugging

```bash
# Build com source maps detalhados
npm run build -- --mode development

# Analisar tamanho do bundle
npm run build -- --mode analyze

# Limpar cache e node_modules
rm -rf node_modules package-lock.json
npm install
```

## 🔍 Troubleshooting

### Problemas Comuns

**1. Erro "Cannot connect to backend"**
```bash
# Verificar se backend está rodando
curl http://localhost:8000/docs

# Verificar variável de ambiente
cat .env
# Deve conter: VITE_API_URL=http://localhost:8000

# Reiniciar dev server
npm run dev
```

**2. Erro "Login failed" ou "401 Unauthorized"**
```bash
# Verificar se usuário existe no backend
# No diretório backend, executar:
docker exec eyesonasset-backend python create_default_user.py
```

**3. Erro de dependências**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install

# Se persistir, usar versão específica do Node
nvm use 18
npm install
```

**4. Página em branco ou erro de build**
```bash
# Verificar erros no console do navegador (F12)

# Limpar cache do Vite
rm -rf node_modules/.vite
npm run dev
```

### Logs e Monitoramento

```bash
# Ver logs do dev server
npm run dev
# Logs aparecem automaticamente no terminal

# Ver requisições HTTP no navegador
# 1. Abra DevTools (F12)
# 2. Aba Network
# 3. Filtre por "XHR" ou "Fetch"

# Ver erros de console
# 1. Abra DevTools (F12)
# 2. Aba Console
```

## 🌐 Variáveis de Ambiente

## 🌐 Variáveis de Ambiente

Arquivo `.env` (já configurado):

```env
# URL base da API (sem /api/v1)
VITE_API_URL=http://localhost:8000

# Para produção, alterar para:
# VITE_API_URL=https://api.seudominio.com
```

**⚠️ Importante:**
- Variáveis devem começar com `VITE_` para serem expostas ao frontend
- Após alterar `.env`, reinicie o dev server (`npm run dev`)
- Não commite `.env` com dados sensíveis (use `.env.example`)

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.jsx        # Página inicial
│   │   ├── Login.jsx       # Autenticação
│   │   ├── Register.jsx    # Cadastro de usuário
│   │   ├── OwnerList.jsx   # Listagem de responsáveis
│   │   ├── OwnerForm.jsx   # Cadastro/edição de responsáveis
│   │   ├── OwnerDetails.jsx # Detalhes do responsável
│   │   ├── AssetList.jsx   # Listagem de ativos
│   │   ├── AssetForm.jsx   # Cadastro/edição de ativos
│   │   ├── AssetDetails.jsx # Detalhes do ativo
│   │   └── __tests__/      # Testes das páginas
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ProtectedRoute.jsx  # Proteção de rotas
│   │   ├── Loading.jsx     # Indicador de carregamento
│   │   ├── Toast.jsx       # Notificações
│   │   ├── ConfirmDialog.jsx   # Confirmação de ações
│   │   └── __tests__/      # Testes dos componentes
│   ├── hooks/              # Custom hooks
│   │   ├── useOwners.js    # Gestão de responsáveis
│   │   ├── useAssets.js    # Gestão de ativos
│   │   └── useToast.js     # Gestão de notificações
│   ├── context/            # Contextos React
│   │   └── AuthContext.jsx # Contexto de autenticação
│   ├── services/           # Serviços e APIs
│   │   ├── api.js          # Configuração do Axios
│   │   └── auth.js         # Serviços de autenticação
│   ├── test/               # Configuração de testes
│   │   └── setup.js        # Setup do Vitest
│   ├── App.jsx             # Componente principal + rotas
│   ├── App.css             # Estilos do App
│   ├── index.css           # Estilos globais
│   └── main.jsx            # Entry point
├── .env                    # Variáveis de ambiente
├── .env.example            # Exemplo de variáveis
├── index.html              # HTML template
├── vite.config.js          # Configuração do Vite
├── vitest.config.js        # Configuração do Vitest
└── package.json            # Dependências
```

## 🎨 Páginas

### Autenticação

#### Login (`/login`)
- Formulário com validação
- Integração com API
- Redirecionamento pós-login
- Feedback de erros

#### Registro (`/register`)
- Cadastro de usuário
- Validação de senha
- Confirmação de senha
- Redirecionamento para login

### Responsáveis

#### Listagem (`/owners`)
- Tabela com todos os responsáveis
- Busca por nome, email ou telefone
- Botão para visualizar detalhes
- Ações de editar e excluir

#### Detalhes (`/owners/:id`)
- Informações completas
- Lista de ativos vinculados
- Ações de editar e excluir

#### Formulário (`/owners/new`, `/owners/edit/:id`)
- Validação de campos obrigatórios:
  - Nome (máx 140 caracteres)
  - Email (formato válido, máx 140 caracteres)
  - Telefone (máx 20 caracteres)
- Estados de loading e erro
- Feedback de sucesso

### Ativos

#### Listagem (`/assets`)
- Tabela com todos os ativos
- Busca por nome ou categoria
- Filtro por categoria
- Exibição do responsável
- Estatísticas (total, categorias)

#### Detalhes (`/assets/:id`)
- Informações completas
- Nome do responsável vinculado
- Link para página do responsável
- Ações de editar e excluir

#### Formulário (`/assets/new`, `/assets/edit/:id`)
- Validação de campos obrigatórios:
  - Nome (máx 140 caracteres)
  - Categoria (máx 60 caracteres)
- Seleção de responsável (opcional)
- Categorias sugeridas
- Autocomplete de categorias

## 🔧 Tecnologias

- **React 18.2** - Biblioteca UI
- **Vite 4.5** - Build tool moderna
- **React Router 6.20** - Roteamento SPA
- **Axios 1.6** - Cliente HTTP
- **Vitest 1.0** - Framework de testes
- **Testing Library 14** - Testes de componentes

## � Autenticação

### Fluxo de Autenticação

1. Usuário faz login com email/senha
2. Backend retorna token JWT
3. Token é armazenado no localStorage
4. Token é enviado em todas as requisições (Authorization header)
5. Em caso de erro 401, usuário é redirecionado para login

### Armazenamento

```javascript
localStorage:
  - eyesonasset_token: JWT token
  - eyesonasset_user: Dados do usuário
```

### Interceptors

- **Request**: Adiciona token JWT automaticamente
- **Response**: Trata erro 401 e redireciona para login

## 🎯 Validações Implementadas

### Responsáveis
- ✅ Nome obrigatório (máx 140 caracteres)
- ✅ Email obrigatório e válido (máx 140 caracteres)
- ✅ Telefone obrigatório (máx 20 caracteres)

### Ativos
- ✅ Nome obrigatório (máx 140 caracteres)
- ✅ Categoria obrigatória (máx 60 caracteres)
- ✅ Responsável opcional

### Usuários (Registro)
- ✅ Nome obrigatório (máx 100 caracteres)
- ✅ Email obrigatório e válido (máx 140 caracteres)
- ✅ Senha mínimo 6 caracteres
- ✅ Confirmação de senha

## 📱 Responsividade

Design mobile-first com breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Design System

### Cores
- Primary: `#667eea` (Gradient com `#764ba2`)
- Success: `#28a745`
- Danger: `#dc3545`
- Warning: `#ffc107`
- Info: `#17a2b8`

### Componentes
- Buttons: Primary, Secondary, Success, Danger
- Forms: Inputs, Selects, Validation states
- Cards: Container padrão
- Tables: Listagens responsivas
- Badges: Tags de categoria
- Alerts: Mensagens contextuais
- Toast: Notificações temporárias
- Loading: Indicadores de carregamento
- Dialog: Modais de confirmação

## 🚀 Deploy

### Variáveis de Ambiente

```env
VITE_API_URL=https://api.exemplo.com/api/v1
```

### Build

```bash
npm run build
```

Arquivos gerados em `dist/`

## 📝 Checklist de Implementação

### Nível 1 ✅
- [x] Tela de cadastro de responsáveis
- [x] Tela de listagem de responsáveis
- [x] Tela de cadastro de ativos
- [x] Tela de listagem de ativos
- [x] Validação de campos obrigatórios
- [x] Interface responsiva

### Nível 2 ✅
- [x] Integração com API (GET)
- [x] Integração com API (POST)
- [x] Integração com API (PUT)
- [x] Integração com API (DELETE)
- [x] Axios configurado
- [x] Tratamento de erros

### Nível 3 ✅
- [x] Página de detalhes de responsáveis
- [x] Página de detalhes de ativos
- [x] Nome do responsável em ativos
- [x] Confirmação de exclusão
- [x] Feedback de operações (Toast)
- [x] Estados de loading

### Nível 4 ✅
- [x] Tela de login
- [x] Tela de registro
- [x] Token no localStorage
- [x] Rotas protegidas
- [x] Redirecionamento em expiração
- [x] Contexto de autenticação

---

## 🎯 Para Começar Rapidamente

### Primeira execução

```bash
# 1. Certifique-se que o backend está rodando
# Ver backend/README.md para instruções

# 2. Instalar dependências (apenas na primeira vez)
cd frontend
npm install

# 3. Verificar arquivo .env
cat .env
# Deve conter: VITE_API_URL=http://localhost:8000

# 4. Iniciar aplicação
npm run dev
```

**✅ Aplicação disponível em:** `http://localhost:3000`

### Login padrão

```
Username: eyesonasset
Password: eyesonasset
```

### Fluxo de uso

1. **Login** → Acesse http://localhost:3000/login
2. **Criar Owner** → Menu "Responsáveis" → "Novo Responsável"
3. **Criar Asset** → Menu "Ativos" → "Novo Ativo"
4. **Visualizar** → Clique no ícone 👁️ para ver detalhes
5. **Editar** → Clique no ícone ✏️ para editar
6. **Excluir** → Clique no ícone 🗑️ e confirme

### Estrutura de arquivos importantes

```
frontend/
├── .env                    # Configuração da API
├── src/
│   ├── services/
│   │   ├── api.js         # Axios com interceptors
│   │   └── auth.js        # Serviços de autenticação
│   ├── context/
│   │   └── AuthContext.jsx # Contexto global de auth
│   ├── hooks/
│   │   ├── useOwners.js   # Hook para CRUD de owners
│   │   ├── useAssets.js   # Hook para CRUD de assets
│   │   └── useToast.js    # Hook para notificações
│   ├── pages/             # Todas as páginas da aplicação
│   └── components/        # Componentes reutilizáveis
└── package.json           # Dependências e scripts
```

### Scripts principais

```bash
npm run dev          # Iniciar dev server (porta 3000)
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

### Verificar se está funcionando

```bash
# 1. Backend deve responder
curl http://localhost:8000/docs

# 2. Frontend deve abrir no navegador
# Acesse: http://localhost:3000

# 3. Login deve funcionar
# Use: eyesonasset / eyesonasset
```

### Problemas comuns

❌ **"Cannot connect to backend"**
```bash
# Verificar se backend está rodando
docker ps | grep eyesonasset
```

❌ **"Login failed"**
```bash
# Recriar usuário no backend
cd ../backend
docker exec eyesonasset-backend python create_default_user.py
```

❌ **Página em branco**
```bash
# Limpar cache e reinstalar
rm -rf node_modules .vite
npm install
npm run dev
```

---

**Desenvolvido usando React, Vite e Axios**

### 📚 Documentação Adicional

- **[Checklist de Primeira Execução](../CHECKLIST.md)** - Guia passo a passo
- **[Comandos Rápidos](../COMMANDS.md)** - Referência rápida
- **[Troubleshooting](../TROUBLESHOOTING.md)** - Solução de problemas
- **[README Principal](../README.md)** - Visão geral do projeto

**Projeto Completo:** ✅ Níveis 1-4 implementados com sucesso!
