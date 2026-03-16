# Drizzle, Better Auth, and Turso Setup Design

## Overview
This document outlines the plan to set up the database and authentication for the Next.js starter template. We are using Drizzle ORM connected to a Turso database (SQLite) and Better Auth for authentication, specifically supporting Google and Facebook OAuth.

## Database Architecture
- **Connection**: We'll use `@libsql/client` to connect to Turso and `drizzle-orm/libsql` for the ORM.
- **Initialization**: A single instance of the database connection will be exported from `db/index.ts`.
- **Schema**: All database tables will be defined in a single file at `db/schema.ts`.
- **Configuration**: A `drizzle.config.ts` file will be placed in the project root to configure Drizzle Kit for migrations and studio access.
- **Environment Variables**: We'll require `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in the `.env.local` file.

## Authentication Architecture
- **Core Configuration**: We'll create `lib/auth.ts` to initialize the `betterAuth` instance.
- **Database Adapter**: We'll use `drizzleAdapter` imported from `better-auth/adapters/drizzle`, passing in our Drizzle db instance and specifying the provider as `sqlite`.
- **OAuth Providers**: We will configure **Google** and **Facebook** OAuth providers.
- **Schema Generation**: We will run `npx auth@latest generate` to automatically output the auth tables (Users, Sessions, Accounts, etc.) directly into our single `db/schema.ts` file.
- **API Route**: We'll set up a Next.js App Router catch-all route at `app/api/auth/[...all]/route.ts` to handle all authentication endpoints (login, callback, etc.).
- **Client Implementation**: We'll create a `lib/auth-client.ts` file exporting `createAuthClient` to be used in our React components for actions like signing in with OAuth and reading the active session.

## Integration & Workflow
- **Environment Setup**: The `.env.local` file will contain:
  - `TURSO_DATABASE_URL` & `TURSO_AUTH_TOKEN`
  - `BETTER_AUTH_SECRET` & `BETTER_AUTH_URL` (e.g., `http://localhost:3000`)
  - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
  - `FACEBOOK_CLIENT_ID` & `FACEBOOK_CLIENT_SECRET`
- **Migration Process**: 
  1. Define custom tables (if any) in `db/schema.ts`.
  2. Run `npx auth@latest generate` to append the Auth tables to `db/schema.ts`.
  3. Run `npx drizzle-kit generate` to create the SQL migration files.
  4. Run `npx drizzle-kit push` (or `migrate`) to apply the schema to the Turso database.
- **Route Protection**: 
  - We'll implement a Next.js `middleware.ts` at the root to check the session (via Better Auth) and protect private routes (like a `/dashboard`), redirecting unauthenticated users to a login page.
  - Server actions and API routes will verify the session using the server-side `auth.api.getSession` method.
- **UI Components**: We'll create a simple login page using the existing Shadcn UI components that includes "Continue with Google" and "Continue with Facebook" buttons leveraging the `auth-client.ts`.
