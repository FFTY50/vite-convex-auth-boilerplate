import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthToken } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const token = useAuthToken();
  const location = useLocation();

  console.log(`[ProtectedRoute] isLoading=${isLoading}, isAuthenticated=${isAuthenticated}, hasToken=${token !== null}`);

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(`[ProtectedRoute] Not authenticated, redirecting to /login`);
    // Preserve the attempted destination for post-login redirect
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
