# Better Auth + Drizzle + Turso Starter

A Next.js starter with Better Auth, Drizzle ORM, and Turso database.

## Setup

1. Clone and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Fill in your OAuth credentials and Turso database URL in .env.local
```

3. Set up OAuth providers:
- Create Google OAuth app: https://console.cloud.google.com/apis/credentials
- Create Facebook app: https://developers.facebook.com/apps
- Add redirect URIs: `http://localhost:3000/api/auth/callback/google` and `http://localhost:3000/api/auth/callback/facebook`

4. Set up Turso database:
```bash
turso db create your-app-name
turso db tokens create your-app-name
# Add URL to .env.local
```

5. Run database migrations:
```bash
npm run db:push
```

6. Start development server:
```bash
npm run dev
```

## Features

- ✅ Google and Facebook OAuth login
- ✅ Secure session management
- ✅ Protected routes
- ✅ Database migrations with Drizzle
- ✅ TypeScript support
- ✅ Tailwind CSS styling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## Environment Variables

```bash
# Database
TURSO_DATABASE_URL=your-turso-database-url-here

# Better Auth
AUTH_SECRET=your-auth-secret-here
AUTH_URL=http://localhost:3000

# OAuth Providers
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_FACEBOOK_ID=your-facebook-app-id
AUTH_FACEBOOK_SECRET=your-facebook-app-secret
```

## Project Structure

- `lib/` - Database and auth configuration
- `schema/` - Database schema definitions
- `components/auth/` - Authentication components
- `app/api/auth/` - Better Auth API routes
- `app/dashboard/` - Protected dashboard page
