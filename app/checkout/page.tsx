import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check, ShieldCheck, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { IMG } from "@/lib/images";
import { getActivePurchase, isPlanKey, PLANS, type PlanKey } from "@/lib/plans";
import { CheckoutForm } from "./checkout-form";

export const metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

const PLAN_FEATURES: Record<PlanKey, string[]> = {
  spark: [
    "1 photo skin analysis",
    "Full personalized routine",
    "10 chat messages",
    "24-hour app access",
  ],
  glow: [
    "3 photo analyses",
    "Full routine + weekly rituals",
    "100 chat messages",
    "7-day app access",
  ],
  radiance: [
    "Unlimited photo analyses",
    "Daily routine refresh",
    "Unlimited AI chat",
    "30-day app access",
  ],
  goddess: [
    "Everything in Radiance",
    "Priority AI processing",
    "Weekly photo deep-dive",
    "30-day app access",
  ],
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; tier?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    const sp = await searchParams;
    const raw = sp.plan ?? sp.tier ?? "";
    redirect(
      `/signup?next=${encodeURIComponent(`/checkout?plan=${raw}`)}`
    );
  }

  const existing = await getActivePurchase(user.id);
  if (existing) {
    redirect("/dashboard");
  }

  const sp = await searchParams;
  const raw = sp.plan ?? sp.tier ?? null;
  const plan = isPlanKey(raw) ? raw : null;
  if (!plan) {
    redirect("/#pricing");
  }

  const p = PLANS[plan];

  return (
    <div className="relative">
      <div className="absolute inset-0 gradient-glow opacity-50 pointer-events-none" />
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-10 md:py-16">
        <Link
          href="/#pricing"
          className="inline-flex items-center gap-1.5 text-[12.5px] tracking-[0.18em] uppercase text-ink-mute hover:text-plum"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to pricing
        </Link>

        <div className="mt-6 grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-12 items-start">
          <div className="card p-7 md:p-10">
            <span className="tag-pill">
              <Sparkles className="w-3 h-3" /> Checkout
            </span>
            <h1 className="display text-3xl md:text-[42px] mt-5 leading-[1.05]">
              Unlock the <span className="gradient-text">{p.name}</span> plan.
            </h1>
            <p className="mt-3 text-[14.5px] text-ink-soft leading-[1.7]">
              One-time payment of <strong>{p.priceLabel}</strong>. Grants{" "}
              <strong>{p.durationLabel}</strong> of access. Your card is not
              stored — no automatic renewal, ever.
            </p>

            <CheckoutForm plan={plan} email={user.email} />

            <p className="mt-6 text-[11px] text-ink-mute leading-relaxed">
              Demo environment — no real charge is made. Use any Luhn-valid
              test card (e.g.{" "}
              <span className="font-mono">4242 4242 4242 4242</span>). In
              production, payments are processed by our PCI-DSS Level 1
              partner.
            </p>
          </div>

          <aside className="space-y-5">
            <div className="relative image-frame aspect-[4/3]">
              <Image
                src={IMG.flowers}
                alt=""
                fill
                sizes="(min-width: 768px) 35vw, 90vw"
                className="object-cover"
              />
            </div>

            <div className="card p-6 md:p-7">
              <div className="label-cap">Order summary</div>
              <h2 className="display text-2xl mt-3">
                GlowVa · {p.name}
              </h2>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="display text-4xl">{p.priceLabel}</span>
                <span className="text-ink-mute text-[12px] uppercase tracking-[0.18em]">
                  one-time
                </span>
              </div>
              <p className="mt-2 text-[13px] text-ink-soft">{p.tagline}</p>

              <div className="mt-4 pt-4 border-t border-line">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-ink-mute">Access duration</span>
                  <strong className="text-plum">{p.durationLabel}</strong>
                </div>
                <div className="flex items-center justify-between text-[13px] mt-1.5">
                  <span className="text-ink-mute">Billing</span>
                  <strong className="text-plum">One-time</strong>
                </div>
              </div>

              <ul className="mt-5 space-y-2.5">
                {PLAN_FEATURES[plan].map((f) => (
                  <li key={f} className="flex gap-2 text-[13px]">
                    <Check
                      className="w-4 h-4 mt-0.5 text-coral-deep shrink-0"
                      strokeWidth={2.5}
                    />
                    <span className="text-ink-soft">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-line flex items-center gap-2 text-[12px] text-ink-mute">
                <ShieldCheck className="w-3.5 h-3.5 text-coral-deep" />
                <span>14-day money-back guarantee.</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
