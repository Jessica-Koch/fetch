# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup

```bash
# Install dependencies across all workspaces
pnpm install

# Start PostgreSQL database
docker-compose up -d

# Run database migrations
cd apps/api && pnpm prisma migrate dev

# Generate Prisma client
cd apps/api && pnpm prisma generate

# Build shared types package (required before running apps)
pnpm run build:shared
```

### Development

```bash
# Start both frontend and backend in development mode
pnpm run dev

# Start only the API server (http://localhost:3001)
pnpm run dev:api

# Start only the web app (http://localhost:5173)
pnpm run dev:web

# Open Prisma Studio (database GUI)
cd apps/api && pnpm prisma studio
```

### Building and Testing

```bash
# Build all packages
pnpm run build

# Lint frontend code
cd apps/web && pnpm run lint

# TypeScript type checking (frontend)
cd apps/web && pnpm run build  # includes tsc -b
```

## Architecture Overview

This is a **pnpm workspace monorepo** with three main packages:

### `apps/api` - Fastify Backend

- **Fastify** server with TypeScript
- **Prisma ORM** with PostgreSQL database
- **Petfinder integration** via FTP upload and web scraping
- REST API serving the web frontend
- Contains services for Petfinder automation in `src/services/`

### `apps/web` - React Frontend

- **React 19** with TypeScript
- **Vite** for development and building
- **SCSS Modules** for component styling
- **React Router** for navigation
- Consumes API from the backend

### `packages/shared` - Shared Types

- **TypeScript type definitions** shared between frontend and backend
- **Must be built first** before running other packages
- Contains core domain types: Dog, Petfinder, API interfaces
- Located in `packages/shared/src/` with exports from `index.ts`

## Database and Schema

- **PostgreSQL** database running via Docker Compose
- **Prisma schema** defines the Dog model with comprehensive rescue management fields
- **Migrations** are in `apps/api/prisma/migrations/`
- Schema includes Petfinder integration tracking fields

## Key Integration Points

### Type Safety

- All API requests/responses use shared TypeScript interfaces from `@fetch/shared`
- Backend imports types with `import type { ... } from '@fetch/shared'`
- Frontend imports types the same way for consistency

### Petfinder Integration

- Automated upload service that can use FTP or web scraping methods
- Fallback mechanism between upload methods
- Tracking fields in database for sync status and errors
- Service classes in `apps/api/src/services/petfinder-*`

### Development Workflow

1. Always build shared package first when making type changes
2. Database changes require running Prisma migrations
3. Frontend uses native fetch API (no axios/other HTTP libraries)
4. Component styles use SCSS modules pattern

## Environment Configuration

### Required for API (`apps/api/.env`)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/fetch_db"
```

### Optional for Petfinder Integration

```env
PETFINDER_FTP_HOST="your_ftp_host"
PETFINDER_FTP_USERNAME="your_ftp_username"
PETFINDER_FTP_PASSWORD="your_ftp_password"
PETFINDER_USERNAME="your_dashboard_username"
PETFINDER_PASSWORD="your_dashboard_password"
PETFINDER_ORGANIZATION_ID="your_org_id"
```
