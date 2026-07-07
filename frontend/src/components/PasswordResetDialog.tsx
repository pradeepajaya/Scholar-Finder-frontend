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

  const styles = themeClasses[theme];

  useEffect(() => {
    if (open) {
      setEmail(defaultEmail);
      setToken("");
      setPassword("");
      setConfirmPassword("");
      setMessage("");
      setError("");
      setShowResetForm(false);
    }
  }, [defaultEmail, open]);

  const handleRequestReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsRequesting(true);

    try {
      const response = await authApi.forgotPassword({
        email: email.trim().toLowerCase(),
      });

      setToken("");
      setShowResetForm(true);
      setMessage(response.message || "Check your email for the reset code.");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsResetting(true);

    try {
      await authApi.resetPassword({
        token: token.trim(),
        password,
        confirmPassword,
      });
      setPassword("");
      setConfirmPassword("");
      setMessage("Password updated. You can sign in with the new password.");
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
            Enter your account email. We will send a reset code to that address.
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

        {showResetForm && (
          <form onSubmit={handleResetPassword} className="space-y-4 border-t border-slate-200 pt-4">
            <div>
              <Label htmlFor="reset-token">Reset code</Label>
              <div className="relative mt-2">
                <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="reset-token"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
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
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="h-12 pl-10"
                  minLength={8}
                  required
                  disabled={isResetting}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-new-password">Confirm password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter new password"
                  className="h-12 pl-10"
                  minLength={8}
                  required
                  disabled={isResetting}
                />
              </div>
            </div>

            <Button
              type="submit"
              className={`h-11 w-full text-white shadow-lg ${styles.button}`}
              disabled={isResetting}
            >
              {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update password
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
