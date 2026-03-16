# Better Auth + Drizzle + Turso Setup Design

## Overview
Setup Next.js app with Better Auth authentication using Google and Facebook OAuth providers, Drizzle ORM for database operations, and Turso SQLite database for data persistence.

## Architecture
- **Authentication**: Better Auth with Google & Facebook OAuth providers
- **Database**: Turso SQLite with Drizzle ORM adapter
- **Session Management**: HTTP-only cookies via Better Auth
- **Flow**: OAuth redirect → callback → user creation/update → session establishment

## Component Structure

### Core Files
- `lib/auth.ts` - Better Auth configuration with providers and Drizzle adapter
- `lib/db.ts` - Turso client connection setup
- `schema/auth.ts` - Better Auth default schema (users, accounts, sessions, verification)
- `app/api/auth/[...auth]/route.ts` - Main auth API handler
- `lib/client-auth.ts` - Client-side auth operations

### Database Schema
Better Auth default tables:
- `users` - Core user information (id, name, email, image)
- `accounts` - OAuth provider links (provider, providerAccountId, userId)
- `sessions` - Active session management
- `verification` - Email verification (if needed later)

## Data Flow
1. User clicks "Login with Google/Facebook"
2. Better Auth redirects to OAuth provider with state token
3. User approves → provider redirects back with auth code
4. Better Auth exchanges code for access tokens + user profile
5. Drizzle adapter creates/updates user records
6. Secure session established via HTTP-only cookies
7. User redirected to dashboard

## Error Handling
- OAuth failure redirects with error messages
- Database connection error handling for Turso
- Session validation middleware for protected routes
- React error boundaries for auth components
- Better Auth handles OAuth edge cases automatically

## Environment Variables
```
TURSO_DATABASE_URL=your-turso-database-url
AUTH_SECRET=your-auth-secret
AUTH_GOOGLE_ID=google-oauth-client-id
AUTH_GOOGLE_SECRET=google-oauth-client-secret
AUTH_FACEBOOK_ID=facebook-oauth-client-id
AUTH_FACEBOOK_SECRET=facebook-oauth-client-secret
```

## Development Workflow
1. Set up Turso cloud database
2. Configure Better Auth with OAuth providers
3. Create database schema with Drizzle
4. Set up auth API routes
5. Implement client-side auth components
6. Test OAuth flows with provider sandboxes

## Migration Strategy
- Use Drizzle Kit for schema migrations
- Generate migrations from schema changes
- Apply migrations to Turso database via CLI
- Support both dev and production databases

## Testing Approach
- Better Auth built-in test utilities for auth flows
- Mock OAuth providers in development
- Integration tests for database operations
- End-to-end testing of complete login flows

## Next Steps
1. Create OAuth apps in Google and Facebook developer consoles
2. Set up Turso database and get connection URL
3. Implement core auth configuration
4. Create database schema and run migrations
5. Build auth components and protected routes
6. Test complete authentication flows
