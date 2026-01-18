# Vite + React + Convex Auth Boilerplate

A minimal SPA boilerplate with authentication scaffolding using:
- **Vite** + **React 18** + **TypeScript**
- **Convex** for backend/database
- **@convex-dev/auth** for authentication (password-based)
- **react-router-dom** for client-side routing

## Features

- ✅ Password authentication (sign up, login, forgot password)
- ✅ Protected routes with redirect preservation
- ✅ Environment variable validation at startup
- ✅ Minimal, functional CSS (no design framework)
- ✅ TypeScript throughout

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Convex](https://convex.dev) account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd vite-convex-auth-boilerplate
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Convex deployment URL:
```
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### 3. Set Up Convex

```bash
npx convex dev
```

This will:
- Authenticate with Convex (opens browser)
- Create or link to a deployment
- Sync the auth schema
- Watch for backend changes

> ⚠️ **WARNING: Create a NEW Convex project!**
> 
> When prompted, select **"Create a new project"** — do NOT link to an existing project with data.
> 
> This boilerplate's schema only includes `authTables`. If you link to an existing project, Convex will **delete any tables and indexes not in this schema**, potentially destroying your data.
> 
> **If you want to add auth to an existing project**, manually merge `authTables` into your existing `convex/schema.ts` instead of using this boilerplate.

### 4. Start Development

In a separate terminal:
```bash
npm run dev
```

Visit http://localhost:5173

## Project Structure

```
├── convex/                 # Convex backend
│   ├── auth.ts             # Auth configuration (Password provider)
│   ├── auth.config.ts      # Auth providers config
│   ├── http.ts             # HTTP routes for auth
│   └── schema.ts           # Database schema with authTables
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx   # Auth guard component
│   ├── lib/
│   │   └── env.ts          # Environment validation
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Dashboard.tsx   # Protected landing page
│   │   └── NotFound.tsx    # 404 page
│   ├── App.tsx             # Route definitions
│   ├── main.tsx            # App entry with providers
│   └── index.css           # Minimal styles
├── .env.example            # Environment template
└── package.json
```

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/login` | Public | Login form |
| `/sign-up` | Public | Registration form |
| `/forgot-password` | Public | Password reset request |
| `/dashboard` | Protected | Main app (after login) |
| `/` | Redirect | → `/dashboard` or `/login` |
| `*` | Public | 404 page |

## Adding Protected Routes

Wrap any route with `ProtectedRoute`:

```tsx
<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>
```

## Customization

### Adding Database Tables

Edit `convex/schema.ts`:

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  // Add your tables here
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
  }),
});

export default schema;
```

### Adding OAuth Providers

See [@convex-dev/auth documentation](https://labs.convex.dev/auth) for adding Google, GitHub, etc.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run convex` | Start Convex dev mode |

## License

MIT
