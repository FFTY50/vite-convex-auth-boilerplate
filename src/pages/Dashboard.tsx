import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AppLayout } from "../components/AppLayout";

export function Dashboard() {
  const me = useQuery(api.users.me);

  return (
    <AppLayout>
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        
        <section className="dashboard-welcome">
          <p>✓ You are logged in</p>
          
          {me === undefined ? (
            <p className="loading-text">Loading user info...</p>
          ) : me ? (
            <div className="user-details">
              {me.email && (
                <p>
                  Email: <strong>{me.email}</strong>
                </p>
              )}
              <p>
                User ID: <code>{me.id}</code>
              </p>
            </div>
          ) : (
            <p className="loading-text">User info not available</p>
          )}
        </section>

        <section className="dashboard-placeholder">
          <p>This is a placeholder dashboard. Add your app content here.</p>
        </section>
      </div>
    </AppLayout>
  );
}
