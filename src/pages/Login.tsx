import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function Login() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the redirect destination from location state, or default to dashboard
  const from = (location.state as { from?: string })?.from || "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    console.log(`[Login] isAuthenticated=${isAuthenticated}, isLoading=${isLoading}`);
    if (isAuthenticated && !isLoading) {
      console.log(`[Login] Redirecting to ${from}`);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(`[Login] Form submit: email="${email}", password="${password}"`);
    
    setError(null);

    // Basic validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      console.log(`[Login] Validation failed: email empty`);
      setError("Email is required");
      return;
    }
    if (!password) {
      console.log(`[Login] Validation failed: password empty`);
      setError("Password is required");
      return;
    }

    setIsSubmitting(true);
    console.log(`[Login] Starting signIn with email="${trimmedEmail}"`);

    try {
      const result = await signIn("password", { email: trimmedEmail, password, flow: "signIn" });
      console.log(`[Login] signIn result:`, result);
      if (result.signingIn) {
        // Navigate immediately; auth should resolve server-side
        console.log(`[Login] signIn successful, navigating to ${from}`);
        navigate(from, { replace: true });
      } else {
        console.log(`[Login] signIn returned signingIn=false`);
        setError("Sign in did not complete");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(`[Login] signIn error:`, err);
      setError(err instanceof Error ? err.message : "Login failed");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            aria-label="Email address"
            aria-required="true"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            disabled={isSubmitting}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              aria-label="Password"
              aria-required="true"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="password-toggle"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="error-message">
            {error}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <nav className="auth-links">
        <Link to="/forgot-password">Forgot Password?</Link>
        <Link to="/sign-up">Create an account</Link>
      </nav>
    </main>
  );
}
