# Better Auth + Drizzle + Turso Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up Next.js app with Better Auth authentication using Google and Facebook OAuth providers, Drizzle ORM, and Turso database.

**Architecture:** Better Auth handles OAuth flow and session management, Drizzle ORM provides database interface, Turso SQLite stores data, all following Better Auth's recommended patterns.

**Tech Stack:** Better Auth, Drizzle ORM, Turso (@libsql/client), Next.js 16, TypeScript

---

### Task 1: Set up Environment Variables

**Files:**
- Create: `.env.local`
- Modify: `.gitignore`

**Step 1: Create environment variables file**

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

**Step 2: Update .gitignore**

Add to existing .gitignore:
```
# Environment variables
.env.local
.env
```

**Step 3: Commit**

```bash
git add .env.local .gitignore
git commit -m "feat: add environment variables template"
```

---

### Task 2: Set up Database Connection

**Files:**
- Create: `lib/db.ts`
- Create: `lib/index.ts`

**Step 1: Create database connection**

```typescript
// lib/db.ts
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
});

export const db = drizzle(client);
```

**Step 2: Create lib index barrel**

```typescript
// lib/index.ts
export * from "./db";
```

**Step 3: Commit**

```bash
git add lib/db.ts lib/index.ts
git commit -m "feat: set up Turso database connection"
```

---

### Task 3: Create Auth Schema

**Files:**
- Create: `schema/auth.ts`
- Create: `schema/index.ts`

**Step 1: Create Better Auth schema**

```typescript
// schema/auth.ts
import { betterAuthSchema } from "better-auth/schema";
import { mysqlTable } from "drizzle-orm/mysql-core";

export const authSchema = {
  user: mysqlTable("auth_user", betterAuthSchema.user),
  account: mysqlTable("auth_account", betterAuthSchema.account),
  session: mysqlTable("auth_session", betterAuthSchema.session),
  verification: mysqlTable("auth_verification", betterAuthSchema.verification),
};
```

**Step 2: Create schema index**

```typescript
// schema/index.ts
export * from "./auth";
```

**Step 3: Commit**

```bash
git add schema/auth.ts schema/index.ts
git commit -m "feat: add Better Auth database schema"
```

---

### Task 4: Configure Better Auth

**Files:**
- Create: `lib/auth.ts`
- Modify: `lib/index.ts`

**Step 1: Create Better Auth configuration**

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { google, facebook } from "better-auth/social";
import { db } from "./db";
import { authSchema } from "../schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: authSchema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    },
    facebook: {
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Session = typeof auth.$Infer.Session;
```

**Step 2: Update lib index**

```typescript
// lib/index.ts
export * from "./db";
export * from "./auth";
```

**Step 3: Commit**

```bash
git add lib/auth.ts lib/index.ts
git commit -m "feat: configure Better Auth with OAuth providers"
```

---

### Task 5: Create Auth API Route

**Files:**
- Create: `app/api/auth/[...auth]/route.ts`

**Step 1: Create auth API handler**

```typescript
// app/api/auth/[...auth]/route.ts
import { auth } from "@/lib/auth";

export const { GET, POST } = auth.handler();
```

**Step 2: Commit**

```bash
git add app/api/auth/[...auth]/route.ts
git commit -m "feat: add Better Auth API route"
```

---

### Task 6: Set up Drizzle Kit Configuration

**Files:**
- Create: `drizzle.config.ts`

**Step 1: Create Drizzle config**

```typescript
// drizzle.config.ts
import type { Config } from "drizzle-kit";
import { client } from "./lib/db";

export default {
  schema: "./schema",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
  },
} satisfies Config;
```

**Step 2: Update package.json scripts**

Add to existing scripts:
```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:push": "drizzle-kit push",
"db:studio": "drizzle-kit studio"
```

**Step 3: Commit**

```bash
git add drizzle.config.ts package.json
git commit -m "feat: configure Drizzle Kit for database migrations"
```

---

### Task 7: Create Database Migrations

**Files:**
- Generate: `drizzle/migrations/`

**Step 1: Generate migration files**

```bash
npm run db:generate
```

**Step 2: Push schema to database**

```bash
npm run db:push
```

**Step 3: Commit**

```bash
git add drizzle/
git commit -m "feat: generate and apply Better Auth database migrations"
```

---

### Task 8: Create Client Auth Setup

**Files:**
- Create: `lib/client-auth.ts`
- Modify: `lib/index.ts`

**Step 1: Create client auth configuration**

```typescript
// lib/client-auth.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
});
```

**Step 2: Update lib index**

```typescript
// lib/index.ts
export * from "./db";
export * from "./auth";
export * from "./client-auth";
```

**Step 3: Commit**

```bash
git add lib/client-auth.ts lib/index.ts
git commit -m "feat: add client-side Better Auth configuration"
```

---

### Task 9: Create Auth Components

**Files:**
- Create: `components/auth/login-button.tsx`
- Create: `components/auth/user-profile.tsx`
- Create: `components/auth/logout-button.tsx`

**Step 1: Create login button component**

```typescript
// components/auth/login-button.tsx
"use client";

import { authClient } from "@/lib/client-auth";

export function LoginButton({ provider }: { provider: "google" | "facebook" }) {
  return (
    <button
      onClick={() => authClient.signIn.social({ provider, callbackURL: "/dashboard" })}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Login with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  );
}
```

**Step 2: Create user profile component**

```typescript
// components/auth/user-profile.tsx
"use client";

import { useAuth } from "@/lib/client-auth";

export function UserProfile() {
  const { user, isPending } = useAuth();

  if (isPending) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div className="flex items-center gap-4">
      <img src={user.image || ""} alt={user.name || ""} className="w-8 h-8 rounded-full" />
      <span>{user.name}</span>
    </div>
  );
}
```

**Step 3: Create logout button**

```typescript
// components/auth/logout-button.tsx
"use client";

import { authClient } from "@/lib/client-auth";

export function LogoutButton() {
  return (
    <button
      onClick={() => authClient.signOut({ callbackURL: "/" })}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
```

**Step 4: Commit**

```bash
git add components/auth/
git commit -m "feat: add auth components (login, profile, logout)"
```

---

### Task 10: Create Protected Route Example

**Files:**
- Create: `app/dashboard/page.tsx`
- Create: `app/layout.tsx`

**Step 1: Create dashboard page**

```typescript
// app/dashboard/page.tsx
import { UserProfile } from "@/components/auth/user-profile";
import { LogoutButton } from "@/components/auth/logout-button";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <UserProfile />
            <LogoutButton />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard!</h2>
          <p>You are successfully authenticated with Better Auth.</p>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Update root layout with auth provider**

```typescript
// app/layout.tsx
import { AuthProvider } from "@/components/auth-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

**Step 3: Create auth provider component**

```typescript
// components/auth-provider.tsx
"use client";

import { AuthProvider as BetterAuthProvider } from "better-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <BetterAuthProvider>{children}</BetterAuthProvider>;
}
```

**Step 4: Commit**

```bash
git add app/dashboard/page.tsx app/layout.tsx components/auth-provider.tsx
git commit -m "feat: add protected dashboard route with auth provider"
```

---

### Task 11: Create Landing Page with Login

**Files:**
- Create: `app/page.tsx`

**Step 1: Create landing page**

```typescript
// app/page.tsx
import { LoginButton } from "@/components/auth/login-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome</h1>
        <div className="space-y-4">
          <p className="text-center text-gray-600">Sign in to access your dashboard</p>
          <div className="space-y-3">
            <LoginButton provider="google" />
            <LoginButton provider="facebook" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add landing page with social login buttons"
```

---

### Task 12: Add Middleware for Route Protection

**Files:**
- Create: `middleware.ts`

**Step 1: Create auth middleware**

```typescript
// middleware.ts
import { authMiddleware } from "better-auth/middleware";

export default authMiddleware({
  redirect: "/",
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

**Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add middleware for protected routes"
```

---

### Task 13: Final Testing and Documentation

**Files:**
- Modify: `README.md`

**Step 1: Update README with setup instructions**

```markdown
# Better Auth + Drizzle + Turso Starter

A Next.js starter with Better Auth, Drizzle ORM, and Turso database.

## Setup

1. Clone and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Fill in your OAuth credentials and Turso database URL
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
```

**Step 2: Final commit**

```bash
git add README.md
git commit -m "docs: add setup instructions and feature list"
```

---

## Testing Checklist

1. **Environment Setup**: Verify all environment variables are set
2. **Database Connection**: Test Turso connection with `npm run db:studio`
3. **OAuth Flow**: Test Google and Facebook login flows
4. **Session Management**: Verify sessions persist across page refreshes
5. **Protected Routes**: Test middleware redirects unauthenticated users
6. **Logout**: Verify logout clears session and redirects properly

## Next Steps

1. Add email verification
2. Implement password reset
3. Add more social providers
4. Set up production deployment
5. Add user profile management
