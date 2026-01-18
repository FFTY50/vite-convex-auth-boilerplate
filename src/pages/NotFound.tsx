import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main className="not-found-container">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/">Go Home</Link>
    </main>
  );
}
