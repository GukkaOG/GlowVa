"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthLinkRow, AuthShell } from "@/components/auth-shell";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign in failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Sign in"
      title={
        <>
          Welcome <span className="gradient-text">back</span>.
        </>
      }
      intro="Sign in to access your dashboard, photo analyses and AI coach."
      footer={
        <AuthLinkRow
          prompt="No account yet?"
          href={`/signup?next=${encodeURIComponent(next)}`}
          cta="Create one"
        />
      }
    >
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
        <label className="block">
          <div className="flex items-center justify-between mb-1.5">
            <span className="label-cap">Password</span>
            <Link
              href="/forgot-password"
              className="text-[11px] text-ink-mute hover:text-plum"
            >
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            required
            autoComplete="current-password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-glow w-full h-12 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {error && (
          <div className="text-[13px] text-coral-deep bg-coral-soft/40 border border-coral-soft rounded-xl px-3 py-2">
            {error}
          </div>
        )}
      </form>
    </AuthShell>
  );
}
