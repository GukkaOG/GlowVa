"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, Loader2, Lock } from "lucide-react";
import { PLANS, type PlanKey } from "@/lib/plans";

function formatCardNumber(v: string): string {
  const digits = v.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExp(v: string): string {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function CheckoutForm({
  plan,
  email,
}: {
  plan: PlanKey;
  email: string;
}) {
  const router = useRouter();
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          cardName,
          cardNumber,
          cardExp,
          cardCvc,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setLoading(false);
    }
  }

  const cfg = PLANS[plan];

  return (
    <form onSubmit={submit} className="mt-7 space-y-4">
      <label className="block">
        <div className="label-cap mb-1.5">Email (account)</div>
        <input
          type="email"
          value={email}
          readOnly
          className="input bg-cream/60 cursor-not-allowed"
        />
      </label>

      <label className="block">
        <div className="label-cap mb-1.5">Cardholder name</div>
        <input
          type="text"
          required
          autoComplete="cc-name"
          className="input"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="As shown on the card"
        />
      </label>

      <label className="block">
        <div className="label-cap mb-1.5">Card number</div>
        <div className="relative">
          <input
            type="text"
            required
            inputMode="numeric"
            autoComplete="cc-number"
            className="input pr-11 font-mono tracking-wider"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4242 4242 4242 4242"
            maxLength={23}
          />
          <CreditCard className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute" />
        </div>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <div className="label-cap mb-1.5">Expires</div>
          <input
            type="text"
            required
            inputMode="numeric"
            autoComplete="cc-exp"
            className="input font-mono"
            value={cardExp}
            onChange={(e) => setCardExp(formatExp(e.target.value))}
            placeholder="MM/YY"
            maxLength={5}
          />
        </label>
        <label className="block">
          <div className="label-cap mb-1.5">CVC</div>
          <input
            type="text"
            required
            inputMode="numeric"
            autoComplete="cc-csc"
            className="input font-mono"
            value={cardCvc}
            onChange={(e) =>
              setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="123"
            maxLength={4}
          />
        </label>
      </div>

      {error && (
        <div className="text-[13px] text-coral-deep bg-coral-soft/40 border border-coral-soft rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-glow w-full h-12 text-[14px] disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Processing payment…
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" /> Pay {cfg.priceLabel} · one-time
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-mute">
        <Lock className="w-3 h-3" />
        <span>
          Secure payment · 256-bit encryption · 14-day money-back guarantee
        </span>
      </div>
    </form>
  );
}
