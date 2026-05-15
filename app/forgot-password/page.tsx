"use client";

import { useState } from "react";
import { AuthLinkRow, AuthShell } from "@/components/auth-shell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Password reset"
      title={
        <>
          Forgot your <span className="gradient-text">password</span>?
        </>
      }
      intro="Enter your email and we'll send you a reset link. If we have an account on file, it'll arrive in a minute."
      footer={
        <AuthLinkRow
          prompt="Remember it?"
          href="/signin"
          cta="Sign in"
        />
      }
    >
      {sent ? (
        <div className="text-[14px] text-ink-soft leading-relaxed">
          If an account exists for <strong>{email}</strong>, a reset link is on
          its way. Check your inbox (and spam folder).
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <div className="label-cap mb-1.5">Email</div>
            <input
              type="email"
              required
              autoComplete="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-glow w-full h-12 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
          {error && (
            <div className="text-[13px] text-coral-deep bg-coral-soft/40 border border-coral-soft rounded-xl px-3 py-2">
              {error}
            </div>
          )}
        </form>
      )}
    </AuthShell>
  );
}
