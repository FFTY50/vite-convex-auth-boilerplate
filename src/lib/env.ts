/**
 * Environment variable validation
 * Validates required env vars at startup
 */

const VITE_CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string | undefined;

if (!VITE_CONVEX_URL) {
  throw new Error(
    "Missing required environment variable: VITE_CONVEX_URL\n" +
      "Please create a .env.local file with:\n" +
      "VITE_CONVEX_URL=https://your-deployment.convex.cloud"
  );
}

export const env = {
  VITE_CONVEX_URL,
} as const;
