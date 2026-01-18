import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";

export function ForgotPassword() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the password provider with reset flow
      await signIn("password", { email, flow: "reset" });
      setSuccess(true);
    } catch (err) {
      // Don't reveal if email exists or not for security
      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="auth-container">
        <h1>Check Your Email</h1>
        <p>
          If an account exists with that email, you will receive a password reset code.
        </p>
        <p>
          <button
            type="button"
            onClick={() => navigate("/reset-password", { state: { email } })}
            className="submit-button"
          >
            Enter Reset Code
          </button>
        </p>
        <nav className="auth-links">
          <Link to="/login">Back to Login</Link>
        </nav>
      </main>
    );
  }

  return (
    <main className="auth-container">
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            aria-label="Email address"
            aria-required="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            autoComplete="email"
          />
        </div>

        {error && (
          <div role="alert" className="error-message">
            {error}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? "Sending..." : "Send Reset Code"}
        </button>
      </form>

      <nav className="auth-links">
        <Link to="/login">Back to Login</Link>
      </nav>
    </main>
  );
}
