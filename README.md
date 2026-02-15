# SPA DO CÍLIOS - Monorepo

Projeto separado em:

- `alpha/` → Frontend React + Vite
- `beta/` → Backend Node.js + Express + Prisma + PostgreSQL

## Subir com Docker (recomendado)

```bash
docker compose up --build
```

Serviços:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000/api/v1
- PostgreSQL: localhost:5432

## Rodando sem Docker

### 1) Backend (`beta`)

```bash
cd beta
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### 2) Frontend (`alpha`)

```bash
cd alpha
cp .env.example .env.local
npm install
npm run dev
```

## Endpoints principais

- `GET /api/v1/clients`
- `GET /api/v1/services`
- `GET /api/v1/appointments`
- `GET /api/v1/financial-records`
- `POST /api/v1/ai/marketing-message`
