# Vite + React + Convex Auth Boilerplate

A minimal SPA boilerplate with authentication scaffolding using:
- **Vite** + **React 18** + **TypeScript**
- **Convex** for backend/database
- **@convex-dev/auth** for authentication (password-based)
- **Resend** for transactional emails
- **react-router-dom** for client-side routing

## Features

- ✅ Password authentication (sign up, login)
- ✅ Email verification on sign-up via OTP
- ✅ Password reset flow via email OTP
- ✅ Protected routes with redirect preservation
- ✅ Environment variable validation at startup
- ✅ Minimal, functional CSS (no design framework)
- ✅ TypeScript throughout

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Convex](https://convex.dev) account
- A [Resend](https://resend.com) account (for email)

### 1. Clone and Install

```bash
git clone https://github.com/FFTY50/vite-convex-auth-boilerplate.git
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

### 4. Configure Resend (Email)

1. Create an account at [resend.com](https://resend.com)
2. Get your API key from the Resend dashboard
3. Set the required environment variables:

```bash
npx convex env set RESEND_API_KEY re_xxxxxxxxxxxxx
npx convex env set SITE_URL http://localhost:5173
```

For production, update `SITE_URL` to your actual domain.

**Optional:** Set a custom sender email (must be from a verified domain in Resend):
```bash
npx convex env set RESEND_FROM_EMAIL "Your App <noreply@yourdomain.com>"
```

### 5. Start Development

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
│   ├── schema.ts           # Database schema with authTables
│   ├── ResendOTP.ts        # Email verification provider
│   └── ResendOTPPasswordReset.ts  # Password reset email provider
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.tsx   # Auth guard component
│   │   ├── AppLayout.tsx        # Layout wrapper
│   │   └── UserMenu.tsx         # User dropdown menu
│   ├── lib/
│   │   └── env.ts          # Environment validation
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx           # With email verification step
│   │   ├── ForgotPassword.tsx   # Request password reset
│   │   ├── ResetPassword.tsx    # Enter OTP + new password
│   │   ├── Dashboard.tsx        # Protected landing page
│   │   └── NotFound.tsx         # 404 page
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
| `/sign-up` | Public | Registration with email verification |
| `/forgot-password` | Public | Request password reset code |
| `/reset-password` | Public | Enter code + new password |
| `/dashboard` | Protected | Main app (after login) |
| `/` | Redirect | → `/dashboard` or `/login` |
| `*` | Public | 404 page |

## Authentication Flows

### Sign Up Flow
1. User enters email + password
2. User receives OTP code via email
3. User enters OTP to verify email
4. User is logged in and redirected to dashboard

### Password Reset Flow
1. User clicks "Forgot Password" on login page
2. User enters email address
3. User receives OTP code via email
4. User enters OTP + new password on reset page
5. Password is updated, user can log in

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

### Customizing Email Templates

Edit the HTML templates in:
- `convex/ResendOTP.ts` - Email verification emails
- `convex/ResendOTPPasswordReset.ts` - Password reset emails

### Adding OAuth Providers

See [@convex-dev/auth documentation](https://labs.convex.dev/auth) for adding Google, GitHub, etc.

## Environment Variables

### Frontend (.env.local)
| Variable | Description |
|----------|-------------|
| `VITE_CONVEX_URL` | Your Convex deployment URL |

### Convex (set via `npx convex env set`)
| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Your Resend API key |
| `SITE_URL` | Your app URL (e.g., `http://localhost:5173`) |
| `RESEND_FROM_EMAIL` | (Optional) Custom sender email |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run convex` | Start Convex dev mode |

## License

MIT
