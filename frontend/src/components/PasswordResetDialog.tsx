import { FormEvent, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, KeyRound, Loader2, Lock, Mail } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/services/api";

type ResetTheme = "blue" | "purple";

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
  theme?: ResetTheme;
}

const themeClasses: Record<ResetTheme, { button: string; accent: string }> = {
  blue: {
    button: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20",
    accent: "text-blue-700 bg-blue-50 border-blue-200",
  },
  purple: {
    button: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20",
    accent: "text-purple-700 bg-purple-50 border-purple-200",
  },
};

export function PasswordResetDialog({
  open,
  onOpenChange,
  defaultEmail = "",
  theme = "blue",
}: PasswordResetDialogProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const styles = themeClasses[theme];
  const trimmedToken = token.trim();
  const passwordMeetsLength = password.length >= 8;
  const confirmPasswordMeetsLength = confirmPassword.length >= 8;
  const hasConfirmPassword = confirmPassword.length > 0;
  const passwordsMismatch = hasConfirmPassword && password !== confirmPassword;
  const canResetPassword =
    trimmedToken.length > 0 &&
    passwordMeetsLength &&
    confirmPasswordMeetsLength &&
    !passwordsMismatch;

  useEffect(() => {
    if (open) {
      setEmail(defaultEmail);
      setToken("");
      setPassword("");
      setConfirmPassword("");
      setMessage("");
      setError("");
      setShowResetForm(false);
      setResetComplete(false);
    }
  }, [defaultEmail, open]);

  const handleRequestReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsRequesting(true);

    try {
      await authApi.forgotPassword({
        email: email.trim().toLowerCase(),
      });

      setToken("");
      setPassword("");
      setConfirmPassword("");
      setResetComplete(false);
      setShowResetForm(true);
      setMessage("Reset code sent. Enter the code and new password below.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not start password reset. Please try again.",
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!trimmedToken) {
      setError("Enter the reset code from your email.");
      return;
    }

    if (!passwordMeetsLength) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!confirmPasswordMeetsLength) {
      setError("Confirm password must be at least 8 characters.");
      return;
    }

    if (passwordsMismatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsResetting(true);

    try {
      await authApi.resetPassword({
        token: trimmedToken,
        password,
        confirmPassword,
      });
      setToken("");
      setPassword("");
      setConfirmPassword("");
      setShowResetForm(false);
      setResetComplete(true);
      setMessage("Password updated. Sign in with your new password.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reset password. Please try again.",
      );
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            {resetComplete
              ? "Your password has been updated."
              : showResetForm
                ? "Enter the reset code from your email and choose a new password."
                : "Enter your account email. We will send a reset code to that address."}
          </DialogDescription>
        </DialogHeader>

        {message && (
          <Alert className={`border ${styles.accent}`}>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!showResetForm && !resetComplete && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <Label htmlFor="reset-email">Email address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 pl-10"
                  required
                  disabled={isRequesting || isResetting}
                />
              </div>
            </div>

            <Button
              type="submit"
              className={`h-11 w-full text-white shadow-lg ${styles.button}`}
              disabled={isRequesting || isResetting}
            >
              {isRequesting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="mr-2 h-4 w-4" />
              )}
              Send reset code
            </Button>
          </form>
        )}

        {showResetForm && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="reset-token">Reset code</Label>
              <div className="relative mt-2">
                <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="reset-token"
                  value={token}
                  onChange={(event) => {
                    setToken(event.target.value);
                    setError("");
                  }}
                  placeholder="Paste reset code"
                  className="h-12 pl-10"
                  required
                  disabled={isResetting}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="new-password">New password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="At least 8 characters"
                  className={`h-12 pl-10 ${
                    password.length > 0 && !passwordMeetsLength
                      ? "border-red-400 focus-visible:ring-red-500"
                      : ""
                  }`}
                  minLength={8}
                  required
                  disabled={isResetting}
                  aria-invalid={password.length > 0 && !passwordMeetsLength}
                  aria-describedby="new-password-help"
                />
              </div>
              <p
                id="new-password-help"
                className={`mt-1 text-xs ${
                  password.length > 0 && !passwordMeetsLength
                    ? "text-red-600"
                    : "text-slate-500"
                }`}
              >
                Use at least 8 characters.
              </p>
            </div>

            <div>
              <Label htmlFor="confirm-new-password">Confirm password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Re-enter new password"
                  className={`h-12 pl-10 ${
                    hasConfirmPassword &&
                    (!confirmPasswordMeetsLength || passwordsMismatch)
                      ? "border-red-400 focus-visible:ring-red-500"
                      : ""
                  }`}
                  minLength={8}
                  required
                  disabled={isResetting}
                  aria-invalid={
                    hasConfirmPassword &&
                    (!confirmPasswordMeetsLength || passwordsMismatch)
                  }
                  aria-describedby="confirm-new-password-help"
                />
              </div>
              <p
                id="confirm-new-password-help"
                className={`mt-1 text-xs ${
                  hasConfirmPassword &&
                  (!confirmPasswordMeetsLength || passwordsMismatch)
                    ? "text-red-600"
                    : "text-slate-500"
                }`}
              >
                {!hasConfirmPassword
                  ? "Re-enter the same password."
                  : !confirmPasswordMeetsLength
                    ? "Confirm password must be at least 8 characters."
                    : passwordsMismatch
                      ? "Passwords do not match."
                      : "Passwords match."}
              </p>
            </div>

            <Button
              type="submit"
              className={`h-11 w-full text-white shadow-lg ${styles.button}`}
              disabled={isResetting || !canResetPassword}
            >
              {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update password
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full"
              disabled={isResetting}
              onClick={() => {
                setToken("");
                setPassword("");
                setConfirmPassword("");
                setMessage("");
                setError("");
                setShowResetForm(false);
              }}
            >
              Send another code
            </Button>
          </form>
        )}

        {resetComplete && (
          <Button
            type="button"
            className={`h-11 w-full text-white shadow-lg ${styles.button}`}
            onClick={() => onOpenChange(false)}
          >
            Back to sign in
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
