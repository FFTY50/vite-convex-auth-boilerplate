import { useState, FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

type Step = "signup" | "verify";

export function SignUp() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading]);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn("password", { email, password, flow: "signUp" });
      if (result.signingIn) {
        // User is signed in immediately (verification not required)
        setSuccessMessage("Account created successfully!");
        navigate("/dashboard", { replace: true });
      } else {
        // Verification required - move to OTP step
        setStep("verify");
        setSuccessMessage("Check your email for a verification code.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!code.trim()) {
      setError("Verification code is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn("password", { email, code, flow: "email-verification" });
      if (result.signingIn) {
        setSuccessMessage("Email verified successfully!");
        navigate("/dashboard", { replace: true });
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await signIn("password", { email, password, flow: "signUp" });
      setSuccessMessage("A new verification code has been sent to your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "verify") {
    return (
      <main className="auth-container">
        <h1>Verify Your Email</h1>
        <p>Enter the verification code sent to {email}</p>

        <form onSubmit={handleVerify} noValidate>
          <div className="form-group">
            <label htmlFor="code">Verification Code</label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              aria-label="Verification code"
              aria-required="true"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(null);
                if (successMessage) setSuccessMessage(null);
              }}
              disabled={isSubmitting}
              autoComplete="one-time-code"
              maxLength={8}
            />
          </div>

          {error && (
            <div role="alert" className="error-message">
              {error}
            </div>
          )}

          {successMessage && (
            <div role="status" className="success-message">
              {successMessage}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="auth-links">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isSubmitting}
            className="link-button"
          >
            Resend verification code
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("signup");
              setCode("");
              setError(null);
              setSuccessMessage(null);
            }}
            className="link-button"
          >
            Back to sign up
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-container">
      <h1>Create Account</h1>

      <form onSubmit={handleSignUp} noValidate>
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
              if (successMessage) setSuccessMessage(null);
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
                if (successMessage) setSuccessMessage(null);
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
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              aria-label="Confirm password"
              aria-required="true"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
                if (successMessage) setSuccessMessage(null);
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

        {successMessage && (
          <div role="status" className="success-message">
            {successMessage}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <nav className="auth-links">
        <Link to="/login">Already have an account? Login</Link>
      </nav>
    </main>
  );
}
