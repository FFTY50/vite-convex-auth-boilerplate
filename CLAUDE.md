# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # TypeScript check + production build
npm run convex     # Start Convex dev mode (syncs backend, watches for changes)
```

Run `npm run convex` in one terminal and `npm run dev` in another for development.

## Architecture

This is a **Vite + React + TypeScript SPA** with **Convex** as the backend.

### Stack
- **Frontend**: React 18, react-router-dom, TypeScript
- **Backend**: Convex (real-time database + serverless functions)
- **Auth**: @convex-dev/auth with Password provider

### Key Patterns

**Data access**: Always use Convex's generated `api` with `useQuery`/`useMutation` from `convex/react`. Never fetch data outside this pattern.

**Auth flow**: App wraps with `ConvexAuthProvider` in `main.tsx`. Use `useConvexAuth()` for auth state and `getAuthUserId(ctx)` in backend functions.

**Protected routes**: Wrap components with `<ProtectedRoute>` which redirects to `/login` and preserves return destination via `location.state.from`.

### File Structure
```
convex/           # Backend: schema, queries, mutations, auth config
  schema.ts       # Database schema (extend authTables here)
  auth.ts         # Auth configuration (Password provider)
  users.ts        # User-related queries (me)
src/
  main.tsx        # Entry: providers (Convex, Auth, Router)
  App.tsx         # Route definitions
  pages/          # Route-level components
  components/     # Reusable UI (ProtectedRoute, AppLayout, UserMenu)
  lib/env.ts      # Environment variable validation
```

### Adding New Features

1. **Schema first**: Define tables in `convex/schema.ts` before writing queries/mutations
2. **Backend functions**: Create queries/mutations in `convex/`, use `v` for argument validation
3. **Frontend**: Access via `useQuery(api.file.functionName)` or `useMutation(api.file.functionName)`

### Environment

Requires `VITE_CONVEX_URL` in `.env.local` pointing to your Convex deployment.
