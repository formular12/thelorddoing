# The Lord's Doing Backend

Backend service for The Lord's Doing inventory and store operations application.

## Technology Stack

- Node.js
- TypeScript
- Express 5
- PostgreSQL
- Prisma ORM
- Zod for request validation
- bcryptjs for password hashing
- Helmet for HTTP security headers
- dotenv for environment configuration

## Requirements

- Node.js and npm
- Access to a PostgreSQL database
- Environment variables configured for the target environment

## Local Development Setup

From the repository root, enter the backend directory:

```bash
cd backend
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the required values:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Port used by the backend server |
| `CORS_ORIGIN` | Permitted frontend origin |
| `AUTH_TOKEN_SECRET` | Authentication secret |

Keep `.env` private. Do not commit it or share production credentials.

Generate the Prisma client:

```bash
npm run prisma:generate
```

### Database migrations

The Prisma schema and migration history are located in `prisma/`.

For an existing database, inspect its migration history and schema before applying changes. For a new local development database, review the migration files and then use the appropriate Prisma migration workflow.

The package script for development migrations is:

```bash
npm run prisma:migrate
```

Do not assume that a new initial migration is required, and do not apply development migrations to production without reviewing the impact first.

### Start the development server

```bash
npm run dev
```

The health endpoint is:

```text
GET /api/health
```

With the default port of `4000`, test it at:

```text
http://localhost:4000/api/health
```

## Production Build

Compile the TypeScript backend:

```bash
npm run build
```

Start the compiled application:

```bash
npm start
```

Configure the hosting environment so that the database connection, port, authentication secret, and allowed frontend origin match the deployment.

## Prisma Utilities

Generate the Prisma client:

```bash
npm run prisma:generate
```

Open Prisma Studio when needed for local development and database inspection:

```bash
npm run prisma:studio
```

Run the seed script only after reviewing its contents and confirming the target database:

```bash
npm run seed
```

Do not run seed operations against production unless their effects are understood and approved.

## Security and Operations

- Use strong, unique secrets in each environment.
- Keep environment files and credentials out of version control.
- Use HTTPS for public endpoints.
- Restrict database access and configure CORS for the intended frontend.
- Back up important data before schema changes.
- Never use real customer credentials or financial records as test data.
- Review migration changes before applying them to a shared database.

## Related Documentation

See the repository root [`README.md`](../README.md) for the overall project structure and frontend setup.
