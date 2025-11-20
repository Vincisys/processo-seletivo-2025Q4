# EyesOnAsset Challenge

Sistema de gerenciamento de ativos desenvolvido com React, TypeScript e FastAPI.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.

## Project Structure

```
eyesonasset-challenge/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   └── eyeson-back/ # Backend API (FastAPI + Python)
```

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run dev:fe`: Start backend in Docker and frontend in dev mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run check-types`: Check TypeScript types across all apps

## CI/CD

O projeto possui workflows do GitHub Actions configurados:

- **CI Pipeline**: Executa testes, build e validações em cada push/PR
- **Deploy**: Deploy automático para produção (configurável)

Veja mais detalhes em [.github/workflows/README.md](.github/workflows/README.md)

## Docker

Para rodar o backend via Docker:

```bash
docker compose up -d backend
```

Para rodar tudo (backend + frontend):

```bash
docker compose up --build
```
