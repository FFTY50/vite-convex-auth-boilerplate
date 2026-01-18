import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Layout wrapper for protected pages.
 * Includes header with navigation and user menu.
 * Use this to wrap all authenticated page content.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header-left">
          <Link to="/dashboard" className="app-logo">
            50 Dollar Manager
          </Link>
        </div>
        <div className="app-header-right">
          <UserMenu />
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
