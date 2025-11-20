# GitHub Actions Workflows

Este diretório contém os workflows de CI/CD do projeto EyesOnAsset Challenge.

## Workflows Disponíveis

### `ci.yml` - Pipeline de CI/CD

Este workflow executa automaticamente em:
- Push para branches `main` ou `develop`
- Pull Requests para branches `main` ou `develop`

**Jobs incluídos:**

1. **backend-tests**: Executa testes do backend Python
   - Instala dependências do sistema (gcc, libffi-dev, libssl-dev)
   - Instala dependências Python
   - Executa pytest com coverage
   - Faz upload dos relatórios de coverage para Codecov

2. **frontend-build**: Build do frontend React
   - Instala dependências com pnpm
   - Builda o projeto frontend
   - Faz upload dos artefatos de build

3. **docker-build**: Build das imagens Docker
   - Builda imagem do backend
   - Builda imagem do frontend
   - Usa cache do GitHub Actions para acelerar builds

4. **lint**: Verificação de tipos TypeScript
   - Executa type checking do frontend

### `deploy.yml` - Deploy (Opcional)

Workflow para deploy automático quando:
- Push para branch `main`
- Tags que começam com `v*` (ex: `v1.0.0`)

**Nota:** Para usar o deploy, configure os secrets no GitHub:
- `DOCKER_USERNAME`: Seu usuário do Docker Hub
- `DOCKER_PASSWORD`: Token de acesso do Docker Hub

## Configuração

### Secrets Necessários (apenas para deploy)

1. Vá em Settings > Secrets and variables > Actions
2. Adicione:
   - `DOCKER_USERNAME`: Usuário do Docker Hub
   - `DOCKER_PASSWORD`: Token de acesso do Docker Hub

### Codecov (Opcional)

O workflow tenta fazer upload de coverage para Codecov. Se você não usar Codecov, o step falhará silenciosamente (`continue-on-error: true`).

Para habilitar:
1. Conecte seu repositório ao Codecov
2. O workflow automaticamente enviará os relatórios

## Status Badge

Adicione este badge ao seu README.md:

```markdown
![CI/CD](https://github.com/SEU_USUARIO/eyesonasset-challenge/workflows/CI/CD%20Pipeline/badge.svg)
```

