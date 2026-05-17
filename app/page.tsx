import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Check,
  MessageCircle,
  Minus,
  Plus,
  ScanFace,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { IMG } from "@/lib/images";
import { PLANS, PLAN_KEYS } from "@/lib/plans";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <HowItWorks />
      <Showcase />
      <Features />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}

/* ----------------------------- Hero ----------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-glow pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <span className="tag-pill">
              <Sparkles className="w-3 h-3" />
              AI Beauty · v2.0
            </span>

            <h1 className="display mt-7 text-[56px] sm:text-[72px] lg:text-[88px] leading-[0.95] tracking-tight">
              Your skin,{" "}
              <span className="gradient-text">decoded</span>
              <br />
              by AI.
            </h1>

            <p className="mt-7 max-w-lg text-[16.5px] leading-[1.65] text-ink-soft">
              Upload one photo. GlowVa reads your skin, builds your
              personalized routine, and answers every beauty question — in
              real time, around the clock.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/signup" className="btn btn-glow h-12 px-7 text-[14px]">
                <Sparkles className="w-4 h-4" /> Start for $2.99
              </Link>
              <Link
                href="/#how-it-works"
                className="btn btn-ghost h-12 px-6 text-[14px]"
              >
                See how it works <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-5 text-[13px] text-ink-mute">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral" />
                <span>One-time payment · No subscription · 14-day refund</span>
              </div>
            </div>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <div className="relative image-frame aspect-[4/5] max-w-[480px] mx-auto shadow-[var(--shadow-lift)]">
        <Image
          src={IMG.faceCloseup}
          alt="Glowing skin reading"
          fill
          priority
          sizes="(min-width: 1024px) 42vw, 80vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum/40 via-transparent to-transparent" />

        {/* Floating analysis chip top-right */}
        <div className="absolute top-5 right-5 card p-3.5 max-w-[180px] backdrop-blur-md bg-ivory/85">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-coral-soft text-coral-deep flex items-center justify-center">
              <ScanFace className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="label-cap text-[9px]">Skin type</div>
              <div className="display text-[16px] leading-none mt-0.5">
                Combination
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-line grid grid-cols-2 gap-2">
            <Stat label="Hydration" value="62%" />
            <Stat label="Glow" value="High" />
          </div>
        </div>

        {/* Chat bubble bottom-left */}
        <div className="absolute -bottom-4 -left-4 sm:-left-10 card p-4 max-w-[260px] backdrop-blur-md bg-ivory/95">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral to-honey text-ivory flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-[13px] leading-snug text-ink-soft">
              <div className="font-semibold text-plum">GlowVa AI</div>
              <p className="mt-1">
                Add niacinamide 5% in the morning. Your tone will lift in 2
                weeks. ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[8.5px] uppercase tracking-[0.16em] text-ink-mute font-semibold">
        {label}
      </div>
      <div className="display text-[15px] mt-0.5 leading-none">{value}</div>
    </div>
  );
}

/* ---------------------------- Logo strip ----------------------------- */

function LogoStrip() {
  const items = [
    "Skin reading",
    "Photo analysis",
    "AI coach 24/7",
    "Routine builder",
    "Ingredient lab",
    "Progress tracker",
  ];
  const loop = [...items, ...items];
  return (
    <section className="py-8 border-y border-line bg-cream/40">
      <div className="fade-mask overflow-hidden">
        <div className="marquee-x">
          {loop.map((it, i) => (
            <span
              key={i}
              className="display text-[26px] text-plum/35 flex-shrink-0 flex items-center gap-8"
            >
              {it}
              <Sparkles className="w-4 h-4 text-coral" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- How it works -------------------------- */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: Camera,
      title: "Upload one photo",
      copy: "A natural-light selfie is all we need. Your face, no filters. Takes 5 seconds.",
    },
    {
      n: "02",
      icon: ScanFace,
      title: "AI reads your skin",
      copy: "GlowVa identifies skin type, hydration, oiliness, tone, and your two main concerns — in under 10 seconds.",
    },
    {
      n: "03",
      icon: Sparkles,
      title: "Get your routine",
      copy: "A morning and evening routine, plus weekly rituals. Ingredients, doses, frequency — every detail.",
    },
    {
      n: "04",
      icon: MessageCircle,
      title: "Chat anytime",
      copy: "Ask your AI beauty coach anything — product swaps, ingredient questions, what to do when your skin reacts.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 py-20 md:py-28"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-[1fr_1.8fr] gap-10 md:gap-16 items-start">
          <div className="md:sticky md:top-28">
            <span className="tag-pill tag-pill-lavender">
              <Zap className="w-3 h-3" />
              How it works
            </span>
            <h2 className="display mt-6 text-5xl md:text-6xl leading-[0.95]">
              Beauty <br />
              <span className="gradient-text">in 4 steps.</span>
            </h2>
            <p className="mt-5 text-[15px] text-ink-soft leading-[1.65] max-w-sm">
              No quizzes. No labs. Just your camera and an AI that's been
              trained on dermatology, not marketing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {steps.map((s) => (
              <article
                key={s.n}
                className="card p-7 md:p-8 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500"
              >
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-coral-soft to-honey-soft opacity-50 blur-2xl pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral to-honey flex items-center justify-center text-ivory shadow-[var(--shadow-glow)]">
                      <s.icon className="w-5 h-5" />
                    </div>
                    <span className="display text-[44px] text-coral-soft leading-none">
                      {s.n}
                    </span>
                  </div>
                  <h3 className="display text-2xl md:text-[28px] mt-6 leading-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[14.5px] text-ink-soft leading-[1.65]">
                    {s.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Showcase --------------------------- */

function Showcase() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative">
            <div className="relative image-frame aspect-[4/5]">
              <Image
                src={IMG.faceNatural}
                alt="Skin in natural light"
                fill
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-4 -bottom-4 sm:-right-8 sm:-bottom-8 card p-5 max-w-[260px] backdrop-blur-md bg-ivory/95">
              <div className="label-cap text-coral-deep">AI suggestion</div>
              <p className="mt-2 text-[14px] leading-snug">
                Swap your night cream — your barrier is reading{" "}
                <span className="font-semibold">slightly compromised</span>{" "}
                this week.
              </p>
              <div className="mt-3 pt-3 border-t border-line flex items-center gap-2 text-[11.5px] text-ink-mute">
                <Sparkles className="w-3 h-3 text-coral" /> Updated 2 min ago
              </div>
            </div>
          </div>

          <div>
            <span className="tag-pill tag-pill-mint">
              <Sparkles className="w-3 h-3" />
              The AI advantage
            </span>
            <h2 className="display mt-6 text-5xl md:text-6xl leading-[0.95]">
              Your skin <br />
              <span className="gradient-text-plum">changes daily.</span>
              <br />
              Your routine should too.
            </h2>
            <p className="mt-6 text-[15.5px] text-ink-soft leading-[1.7] max-w-md">
              Most apps give you one routine and call it done. GlowVa
              re-reads your skin every time you upload a new photo. The
              routine you get on Monday isn't the one you get on Friday — and
              that's the point.
            </p>

            <ul className="mt-8 space-y-3.5">
              {[
                "Re-analyze your skin as often as you'd like",
                "Track hydration, oiliness and glow over time",
                "Get product swaps when your skin shifts",
                "Chat with the AI for any beauty question",
              ].map((f) => (
                <li key={f} className="flex gap-3 text-[14.5px]">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-coral to-honey flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-ivory" strokeWidth={3} />
                  </span>
                  <span className="text-ink-soft">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Features --------------------------- */

function Features() {
  const features = [
    {
      title: "Photo skin analysis",
      copy: "One upload, full reading. Skin type, hydration, oiliness, sensitivity, brightness — all under 10 seconds.",
      icon: Camera,
    },
    {
      title: "Personalized routine",
      copy: "Morning, evening and weekly rituals. Every step has a dose, a reason, and a defendable purpose.",
      icon: Sparkles,
    },
    {
      title: "Unlimited AI coach",
      copy: "Ask anything — ingredients, product swaps, reactions, layering. Plain answers, on tap, 24/7.",
      icon: MessageCircle,
    },
    {
      title: "Ingredient intelligence",
      copy: "Every recommended active is cross-referenced with derm literature. We say no when it's not needed.",
      icon: ScanFace,
    },
    {
      title: "Progress over time",
      copy: "Upload a new photo any time. Watch your hydration and glow scores climb over weeks.",
      icon: Star,
    },
    {
      title: "No subscription traps",
      copy: "One purchase, fixed window. No auto-renewal. No card on file. Cancel doesn't even apply.",
      icon: Zap,
    },
  ];

  return (
    <section
      id="features"
      className="scroll-mt-24 py-20 md:py-28 bg-gradient-to-b from-cream/60 to-blush"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="tag-pill">
            <Sparkles className="w-3 h-3" />
            What you get
          </span>
          <h2 className="display mt-6 text-5xl md:text-6xl leading-[0.95]">
            Everything <br />
            <span className="gradient-text">your skin needs.</span>
          </h2>
          <p className="mt-5 text-[15.5px] text-ink-soft leading-[1.7]">
            No bloat, no upsell. Six features that actually do their job and
            step back.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((f) => (
            <article
              key={f.title}
              className="card p-7 group hover:-translate-y-1 transition-transform duration-500"
            >
              <div className="w-12 h-12 rounded-2xl gradient-card flex items-center justify-center text-coral-deep">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="display text-[26px] mt-6 leading-tight">
                {f.title}
              </h3>
              <p className="mt-3 text-[14.5px] text-ink-soft leading-[1.65]">
                {f.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Pricing --------------------------- */

function Pricing() {
  const FEATURES: Record<string, string[]> = {
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
      "Email support",
    ],
    radiance: [
      "Unlimited photo analyses",
      "Daily routine refresh",
      "Unlimited AI chat",
      "30-day app access",
      "Progress tracker",
      "Email support",
    ],
    goddess: [
      "Everything in Radiance",
      "Priority AI processing",
      "Weekly photo deep-dive",
      "Seasonal routine swap",
      "Priority email support",
      "30-day app access",
    ],
  };

  return (
    <section
      id="pricing"
      className="scroll-mt-24 py-20 md:py-28 bg-gradient-to-b from-blush to-cream/60"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="tag-pill">
            <Sparkles className="w-3 h-3" />
            Pricing
          </span>
          <h2 className="display mt-6 text-5xl md:text-6xl leading-[0.95]">
            One purchase. <br />
            <span className="gradient-text">No renewals.</span>
          </h2>
          <p className="mt-5 text-[15.5px] text-ink-soft leading-[1.7]">
            Pick how long you'd like access for. Pay once. We don't keep your
            card on file. 14-day money-back guarantee on every plan.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {PLAN_KEYS.map((key) => {
            const p = PLANS[key];
            const featured = p.featured;
            return (
              <article
                key={key}
                className={[
                  "relative rounded-[28px] p-7 flex flex-col border transition-transform duration-500 hover:-translate-y-1",
                  featured
                    ? "bg-plum text-ivory border-plum shadow-[var(--shadow-glow)]"
                    : "card",
                ].join(" ")}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-coral to-honey text-ivory text-[10px] tracking-[0.22em] uppercase font-bold rounded-full px-4 py-1.5 shadow-[var(--shadow-glow)]">
                    Most popular
                  </span>
                )}
                <div
                  className={[
                    "text-[11px] uppercase tracking-[0.18em] font-semibold",
                    featured ? "text-coral-soft" : "text-coral-deep",
                  ].join(" ")}
                >
                  {p.name}
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="display text-[56px] leading-none">
                    {p.priceLabel}
                  </span>
                </div>
                <div
                  className={[
                    "mt-2 text-[12.5px] uppercase tracking-[0.18em] font-medium",
                    featured ? "text-ivory/65" : "text-ink-mute",
                  ].join(" ")}
                >
                  {p.durationLabel} · one-time
                </div>
                <p
                  className={[
                    "mt-3 text-[14px]",
                    featured ? "text-ivory/80" : "text-ink-soft",
                  ].join(" ")}
                >
                  {p.tagline}
                </p>

                <ul className="mt-6 space-y-3 flex-1">
                  {FEATURES[key].map((f) => (
                    <li
                      key={f}
                      className="flex gap-2.5 text-[13.5px] leading-snug"
                    >
                      <Check
                        className={[
                          "w-4 h-4 mt-0.5 shrink-0",
                          featured ? "text-honey" : "text-coral-deep",
                        ].join(" ")}
                        strokeWidth={2.5}
                      />
                      <span
                        className={featured ? "text-ivory/90" : "text-ink-soft"}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/checkout?plan=${key}`}
                  className={[
                    "btn h-11 mt-7 w-full text-[13.5px]",
                    featured ? "btn-glow" : "btn-ink",
                  ].join(" ")}
                >
                  Get {p.name} <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center text-[12px] text-ink-mute max-w-xl mx-auto leading-[1.7]">
          Charges appear as <strong>GLOWVA</strong> on your statement. No
          automatic renewal. 14-day money-back guarantee.
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FAQ ----------------------------- */

function FAQ() {
  const faqs = [
    {
      q: "How does the photo analysis work?",
      a: "Upload a clear selfie in natural light, no makeup. Our AI reads your skin's signals — type, hydration, oiliness, sensitivity, brightness — and identifies your two main concerns. The whole thing takes under 10 seconds. Your photo is processed and never stored beyond the analysis.",
    },
    {
      q: "Is this a replacement for a dermatologist?",
      a: "No. GlowVa is an AI beauty assistant, not a medical device. If you have a skin condition — severe acne, eczema, rosacea, suspicious moles — see a dermatologist. We help you build a smart routine and answer ingredient questions, not diagnose disease.",
    },
    {
      q: "Will my card be charged again?",
      a: "No. Every plan is one-time. We don't keep your card on file for renewals. When your access expires, you can purchase a new window any time. Cancel doesn't even apply — there's nothing to cancel.",
    },
    {
      q: "What's the difference between the plans?",
      a: "Spark ($2.99) is a 24-hour trial with one analysis and 10 chat messages. Glow ($14.99) gives you 7 days, 3 analyses and 100 messages. Radiance ($39.99) and Goddess ($69.99) are 30 days with unlimited everything — Goddess just gets priority processing and a weekly deep-dive.",
    },
    {
      q: "Can I get a refund?",
      a: "Yes. 14-day money-back guarantee, no questions. Email us at support@glow-va.com from your account address and we'll refund within 3 business days.",
    },
  ];
  return (
    <section
      id="faq"
      className="scroll-mt-24 py-20 md:py-28"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16">
          <div className="md:sticky md:top-28 self-start">
            <span className="tag-pill tag-pill-mint">
              <MessageCircle className="w-3 h-3" />
              FAQ
            </span>
            <h2 className="display mt-6 text-5xl md:text-6xl leading-[0.95]">
              Real <br />
              <span className="gradient-text-plum">answers.</span>
            </h2>
            <p className="mt-5 text-[14.5px] text-ink-soft leading-[1.7] max-w-xs">
              Don't see what you need?{" "}
              <Link
                href="/legal/contact"
                className="underline underline-offset-2 hover:text-plum"
              >
                Email us directly.
              </Link>
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group card p-7 hover:border-coral-soft transition-colors"
              >
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                  <span className="display text-2xl md:text-[28px] pr-8 leading-tight">
                    {f.q}
                  </span>
                  <span className="shrink-0 mt-1.5 w-9 h-9 rounded-full bg-coral-soft text-coral-deep flex items-center justify-center group-open:bg-coral group-open:text-ivory transition-colors">
                    <Plus className="w-4 h-4 group-open:hidden" />
                    <Minus className="w-4 h-4 hidden group-open:block" />
                  </span>
                </summary>
                <p className="mt-5 text-ink-soft leading-[1.7] text-[15px] max-w-2xl">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Final CTA --------------------------- */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={IMG.faceLight}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-plum/95 via-plum/85 to-coral-deep/70" />
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-[1.5fr_1fr] gap-10 items-end">
        <div className="text-ivory">
          <span className="tag-pill bg-ivory/10 text-ivory border-ivory/20">
            <Sparkles className="w-3 h-3" />
            Begin
          </span>
          <h2 className="display mt-7 text-5xl md:text-7xl leading-[0.95]">
            Beautiful skin <br />
            starts with one <br />
            <span className="gradient-text">photo.</span>
          </h2>
          <p className="mt-7 max-w-md text-[15.5px] leading-[1.7] text-ivory/75">
            $2.99 to start. No card on file. 14-day money-back guarantee.
            Cancel doesn't apply — there's nothing to cancel.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="btn btn-glow h-12 px-7 text-[14px]"
            >
              <Sparkles className="w-4 h-4" /> Try GlowVa now
            </Link>
            <Link href="/#pricing" className="btn btn-light h-12 px-6 text-[14px]">
              See plans
            </Link>
          </div>
        </div>

        <div className="text-ivory/70 text-[12px] tracking-[0.18em] uppercase leading-relaxed self-end">
          <div className="flex items-center gap-2 text-ivory/55">
            <Sparkles className="w-3 h-3" />
            <span>GlowVa</span>
          </div>
          <div className="mt-4 text-ivory/85">Est. 2026</div>
          <div className="mt-1">Bradenton · FL · USA</div>
          <div className="mt-4 text-ivory/55">AI beauty, made for your skin.</div>
        </div>
      </div>
    </section>
  );
}
