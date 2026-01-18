import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Test query to check auth state from backend
export const checkAuth = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    console.log("Auth userId:", userId);
    return {
      isAuthenticated: userId !== null,
      userId,
    };
  },
});

// Test if we can query users table
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((u) => ({ id: u._id, email: u.email ?? null }));
  },
});
