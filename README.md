# The Lord's Doing Global Concept Services Nig. Ltd.

Inventory management and store operations application with a React frontend and a Node.js/Express backend.

**GitHub repository:** https://github.com/formular12/thelorddoing

## Technology Stack

### Frontend
- React 18
- Vite 6
- JavaScript and CSS

### Backend
- Node.js
- TypeScript
- Express 5
- PostgreSQL
- Prisma ORM
- Zod validation
- bcryptjs for password hashing
- Helmet for HTTP security headers

## Project Structure

```text
thelorddoing/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── db.ts
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
├── public/
├── src/
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── vite.config.js
```

## Prerequisites

Install:
- Node.js and npm
- PostgreSQL, or access to a compatible PostgreSQL database

## Frontend Setup

From the project root:

```bash
npm install
npm run dev
```

Vite will display the local development URL in the terminal.

To create a production build:

```bash
npm run build
```

The generated frontend files are placed in `dist/`.

## Backend Setup

Enter the backend directory:

```bash
cd backend
npm install
```

Create your environment file from the example:

```bash
cp .env.example .env
```

Edit `backend/.env` and configure the database connection and a strong, unique authentication secret. Do not commit `.env` or production credentials to Git.

Generate the Prisma client:

```bash
npm run prisma:generate
```

Apply database migrations using the migration workflow appropriate to your environment. For a new local development database, review the existing migrations first; do not run an initial migration blindly against an existing database.

Start the development server:

```bash
npm run dev
```

The backend health endpoint is:

```text
GET /api/health
```

For a local server using port 4000, the URL is:

```text
http://localhost:4000/api/health
```

Build the backend for production:

```bash
npm run build
npm start
```

## Environment Configuration

The backend environment example is `backend/.env.example`. It documents the following settings:

- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — backend listening port
- `CORS_ORIGIN` — permitted frontend origin
- `AUTH_TOKEN_SECRET` — secret used for authentication tokens

Use the actual values required by your deployment environment. Never publish database credentials, authentication secrets, passwords, or other private configuration.

## Database and Migrations

Prisma schema and migration files are maintained in `backend/prisma/`.

Before applying migrations to a shared or production database:
1. Confirm the target database and connection string.
2. Review the pending migrations.
3. Ensure a recoverable database backup exists.
4. Use the deployment-appropriate migration command.

Do not run development seeding against a production database unless the seed data and its effects have been reviewed.

## Deployment

The application is deployed with a separately hosted frontend and backend. Deployment configuration, environment variables, database access, and allowed CORS origins must match the hosting environment.

The frontend production build is generated with `npm run build`. The backend production build is generated with `npm run build` from the `backend/` directory.

## Security

- Keep `.env` files and credentials out of version control.
- Use strong, unique production secrets.
- Use HTTPS for public application endpoints.
- Restrict database access and permitted frontend origins.
- Back up production data before schema changes.
- Never commit real customer, financial, or authentication data.

## License

No open-source license has been specified. All rights remain with the project owner unless a license is added.
