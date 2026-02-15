# Beta (Backend)

API Node.js com Express + Prisma + PostgreSQL.

## Setup local

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run seed
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run prisma:migrate`
- `npm run seed`
