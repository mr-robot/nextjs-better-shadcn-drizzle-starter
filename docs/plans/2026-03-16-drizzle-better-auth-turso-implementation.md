# Drizzle, Better Auth, and Turso Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement Drizzle ORM with Turso SQLite and Better Auth (Google/Facebook) in the Next.js starter.

**Architecture:** Single database schema file for application and auth tables. Server-side auth logic in `lib/auth.ts` and client-side in `lib/auth-client.ts`. Next.js middleware will protect private routes.

**Tech Stack:** Next.js (App Router), Drizzle ORM, Turso (LibSQL), Better Auth, React.

---

### Task 1: Environment Setup

**Files:**
- Create: `my-app/.env.local`

**Step 1: Create environment file with placeholders**
```env
TURSO_DATABASE_URL="libsql://your-db-name.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"
BETTER_AUTH_SECRET="your-better-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
```

**Step 2: Verify it doesn't break build**
Run: `npm run build` in `my-app`
Expected: PASS

**Step 3: Commit**
```bash
git add my-app/.env.local
git commit -m "chore: add environment variables template"
```

---

### Task 2: Database Connection & Config Setup

**Files:**
- Create: `my-app/db/index.ts`
- Create: `my-app/drizzle.config.ts`
- Create: `my-app/db/schema.ts`

**Step 1: Create empty schema**
```typescript
// my-app/db/schema.ts
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const dummyTable = sqliteTable("dummy", {
  id: text("id").primaryKey(),
});
```

**Step 2: Create DB connection**
```typescript
// my-app/db/index.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
```

**Step 3: Create Drizzle config**
```typescript
// my-app/drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
```

**Step 4: Verify typecheck**
Run: `npx tsc --noEmit` in `my-app`
Expected: PASS

**Step 5: Commit**
```bash
git add my-app/db my-app/drizzle.config.ts
git commit -m "feat: setup database connection and drizzle config"
```

---

### Task 3: Better Auth Setup and Schema Generation

**Files:**
- Create: `my-app/lib/auth.ts`
- Modify: `my-app/db/schema.ts`

**Step 1: Initialize Better Auth**
```typescript
// my-app/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        }
    },
});
```

**Step 2: Generate Auth Schema**
Run: `npx auth@latest generate --output ./db/schema.ts --y` in `my-app`
Expected: PASS (schema appended)

**Step 3: Verify typecheck**
Run: `npx tsc --noEmit` in `my-app`
Expected: PASS

**Step 4: Commit**
```bash
git add my-app/lib/auth.ts my-app/db/schema.ts
git commit -m "feat: configure better auth and generate auth schema"
```

---

### Task 4: Auth API Route & Client Setup

**Files:**
- Create: `my-app/app/api/auth/[...all]/route.ts`
- Create: `my-app/lib/auth-client.ts`

**Step 1: Setup Catch-all Route**
```typescript
// my-app/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth"; // Note: Adjust import to relative if no alias: ../../../../lib/auth
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

**Step 2: Setup Auth Client**
```typescript
// my-app/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
```

**Step 3: Verify typecheck**
Run: `npx tsc --noEmit` in `my-app`
Expected: PASS

**Step 4: Commit**
```bash
git add my-app/app/api/auth my-app/lib/auth-client.ts
git commit -m "feat: setup auth api route and client"
```

---

### Task 5: Middleware Route Protection

**Files:**
- Create: `my-app/middleware.ts`

**Step 1: Create Middleware**
```typescript
// my-app/middleware.ts
import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "better-auth/types";

export async function middleware(request: NextRequest) {
    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        },
    );

    if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
```

**Step 2: Verify typecheck**
Run: `npx tsc --noEmit` in `my-app`
Expected: PASS

**Step 3: Commit**
```bash
git add my-app/middleware.ts
git commit -m "feat: add middleware for route protection"
```
