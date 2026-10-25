# The Lord's Doing backend

Backend foundation for the recreated inventory/store application.

## Stack

- Node.js + TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Zod validation

## Local setup

1. Install PostgreSQL and create a database named `thelorddoing`.
2. Copy `.env.example` to `.env` and update `DATABASE_URL`.
3. Install packages:

```bash
npm install
```

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Create the database tables:

```bash
npx prisma migrate dev --name init
```

6. Seed the observed Bank Registration, NYP Registration and DANGOTE Company Registration data:

```bash
npm run seed
```

7. Start the backend:

```bash
npm run dev
```

Health check:

`GET http://localhost:4000/api/health`

The first backend vertical slice intentionally covers Bank Registration, NYP Registration and Company Registration. The remaining modules are represented in the relational schema and will be connected screen-by-screen next.
