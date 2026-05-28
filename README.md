# CalcScope

CalcScope is an interactive calculus graphing platform. This repository is an early foundation: the backend now includes beginner-friendly JWT authentication, while graphing, saving graphs, and calculus logic are still placeholders for later commits.

## Folder Structure

```text
CalcScope/
  apps/
    client/              React + TypeScript + Vite frontend
    server/              Node.js + Express + TypeScript backend
  packages/
    shared/              Shared constants and types used by both apps
  package.json           Root workspace scripts
  tsconfig.base.json     Shared TypeScript defaults
```

### Why Each Folder Exists

- `apps/client`: Holds everything that runs in the browser. It owns UI components, pages, styles, and frontend API calls.
- `apps/server`: Holds everything that runs on the backend. It owns Express routes, controllers, services, database access, and authentication boundaries.
- `packages/shared`: Holds small cross-app definitions such as route paths, API response shapes, and future shared math types. Keeping this small prevents hidden coupling.
- `tsconfig.base.json`: Keeps TypeScript rules consistent without forcing every app to duplicate the same compiler settings.
- Root `package.json`: Defines the monorepo workspaces and simple scripts for running frontend and backend separately.

## Architecture Decisions

This project uses a monorepo because CalcScope has a frontend, backend, and shared types that should evolve together. The structure stays beginner-friendly by separating responsibilities clearly:

- React handles the user interface.
- Express exposes API endpoints.
- PostgreSQL stores users and saved graphs later.
- JWT authenticates protected API requests.
- bcrypt hashes user passwords before they are stored.
- Shared code is limited to stable contracts, not business logic.

The current setup avoids implementing auth, graphing, and calculus so the foundation stays easy to understand.

## Request Flow

1. A user interacts with the React app in `apps/client`.
2. The frontend calls the backend with `fetch`, using the API base URL from `VITE_API_URL`.
3. Express receives the request in `apps/server/src/app.ts`.
4. A route forwards the request to a controller.
5. Controllers call services for business logic.
6. Services will use database helpers when persistence is needed.
7. Express sends JSON back to the frontend.

## Authentication Flow

1. User submits email and password from the frontend.
2. Backend validates the request body.
3. Registration hashes the password with bcrypt and stores only `password_hash` in PostgreSQL.
4. Login finds the user by email and uses bcrypt to compare the submitted password with the stored hash.
5. Backend signs a JWT when credentials are valid.
6. Frontend stores the token in `localStorage` so a page refresh can restore the session.
7. Protected requests include `Authorization: Bearer <token>`.
8. Auth middleware verifies the token before protected controllers run.

This is stateless JWT authentication. The backend does not keep a server-side
login session for each user; instead, every protected request proves who the user
is by sending a signed token. Signing out removes the saved token from the
browser. If the token is missing, invalid, or expired, the frontend sends the user
back to the login/register view.

Available auth routes:

```text
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

Run the users table migration before using auth:

```powershell
psql $env:DATABASE_URL -f apps/server/migrations/001_create_users.sql
```

## Frontend and Backend Communication

The frontend reads `VITE_API_URL` from `apps/client/.env`. During local development it should point to the backend:

```env
VITE_API_URL=http://localhost:4000/api
```

The backend exposes routes under `/api`, such as:

```text
GET /api/health
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

The `/api/auth/me` route is protected and requires a valid JWT in the `Authorization` header.

## Environment Variables

Copy the example files before running locally:

```powershell
Copy-Item apps/server/.env.example apps/server/.env
Copy-Item apps/client/.env.example apps/client/.env
```

Server variables:

- `PORT`: Express port.
- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret used later to sign JWTs.
- `CLIENT_URL`: Frontend URL allowed by CORS.

Client variables:

- `VITE_API_URL`: Backend API base URL.

## How to Run

Install dependencies from the repository root:

```powershell
npm install
```

Run the backend:

```powershell
npm run dev:server
```

Run the frontend in a second terminal:

```powershell
npm run dev:client
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Health check: `http://localhost:4000/api/health`

## First Git Commit

The first commit should contain only the project foundation:

- Monorepo workspace setup
- React/Vite/Tailwind starter
- Express/TypeScript starter
- PostgreSQL connection helper
- Environment examples
- Auth route placeholders
- Shared types/constants package
- README and `.gitignore`

Suggested first commit message:

```text
chore: scaffold CalcScope monorepo foundation
```

## What `.gitignore` Should Ignore

The `.gitignore` excludes:

- `node_modules/`: dependencies can be reinstalled.
- `dist/`, `build/`, `coverage/`: generated outputs.
- `.env` files: local secrets and machine-specific configuration.
- log files: generated during package manager or runtime failures.
- editor and OS files: not part of the application.
- local database files: not needed for PostgreSQL-backed development.

## Commit Naming Strategy

Use short Conventional Commit-style messages:

- `chore:` setup, tooling, config, maintenance.
- `feat:` user-facing feature work.
- `fix:` bug fixes.
- `docs:` documentation-only changes.
- `refactor:` code restructuring without behavior changes.
- `test:` test-only changes.

Examples:

```text
feat: add user registration endpoint
feat: render equation input form
fix: handle missing api url in client
docs: explain graph saving flow
```
