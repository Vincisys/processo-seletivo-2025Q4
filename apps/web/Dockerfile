# Stage 1: Builder
FROM node:20-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

# Instalação global do TurboRepo
RUN npm install -g turbo

# Gera um prune do workspace para a app web (otimização de cache do docker)
RUN turbo prune --scope=web --docker

# Stage 2: Installer e Build
FROM node:20-slim AS installer
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copia os arquivos de dependência (lockfiles)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Instala as dependências
RUN pnpm install --frozen-lockfile
RUN npm install -g turbo

# Copia o código fonte do workspace
COPY --from=builder /app/out/full/ .
COPY turbo.json ./turbo.json

# Builda o projeto
RUN turbo run build --filter=web

# Stage 3: Runner (Nginx para servir os estáticos)
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove configurações padrão do nginx
RUN rm -rf ./*

# Copia os arquivos buildados do frontend
COPY --from=installer /app/apps/web/dist .

# Copia configuração customizada do Nginx (necessário para SPA routing)
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

