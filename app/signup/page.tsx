"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthLinkRow, AuthShell } from "@/components/auth-shell";

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/checkout?plan=spark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          marketingOptIn,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Get started"
      title={
        <>
          Create your <span className="gradient-text">account</span>.
        </>
      }
      intro="Sign up in 30 seconds. Your photo analysis and routine are waiting on the other side."
      footer={
        <AuthLinkRow
          prompt="Already a member?"
          href={`/signin?next=${encodeURIComponent(next)}`}
          cta="Sign in"
        />
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <div className="label-cap mb-1.5">First name</div>
          <input
            type="text"
            autoComplete="given-name"
            className="input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="What should we call you?"
          />
        </label>
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
          <div className="label-cap mb-1.5">Password</div>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </label>
        <label className="flex items-start gap-2 text-[13px] text-ink-soft cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 accent-coral"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
          />
          <span>
            Send me skincare tips and product updates. Unsubscribe anytime.
          </span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-glow w-full h-12 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create my account"}
        </button>
        {error && (
          <div className="text-[13px] text-coral-deep bg-coral-soft/40 border border-coral-soft rounded-xl px-3 py-2">
            {error}
          </div>
        )}
        <p className="text-[11px] text-ink-mute">
          By creating an account you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </form>
    </AuthShell>
  );
}
