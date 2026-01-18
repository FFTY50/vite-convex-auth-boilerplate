import { useState, FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";

export function ResetPassword() {
  const { signIn } = useAuthActions();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!code.trim()) {
      setError("Reset code is required");
      return;
    }
    if (!newPassword) {
      setError("New password is required");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn("password", {
        email,
        code,
        newPassword,
        flow: "reset-verification",
      });
      if (result.signingIn) {
        setSuccess(true);
      } else {
        setError("Password reset failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="auth-container">
        <h1>Password Reset Complete</h1>
        <p>Your password has been successfully reset.</p>
        <nav className="auth-links">
          <Link to="/login">Go to Login</Link>
        </nav>
      </main>
    );
  }

  return (
    <main className="auth-container">
      <h1>Reset Your Password</h1>
      <p>Enter the code from your email and your new password.</p>

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
          <label htmlFor="code">Reset Code</label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            aria-label="Reset code"
            aria-required="true"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(null);
            }}
            disabled={isSubmitting}
            autoComplete="one-time-code"
            maxLength={8}
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <div className="password-input">
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              aria-label="New password"
              aria-required="true"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError(null);
              }}
              disabled={isSubmitting}
              autoComplete="new-password"
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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <div className="password-input">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              aria-label="Confirm new password"
              aria-required="true"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              disabled={isSubmitting}
              autoComplete="new-password"
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
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <nav className="auth-links">
        <Link to="/forgot-password">Request new code</Link>
        <Link to="/login">Back to Login</Link>
      </nav>
    </main>
  );
}
