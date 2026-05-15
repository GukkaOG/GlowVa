import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import {
  ArrowRight,
  Camera,
  CreditCard,
  MessageCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { getDb, schema } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";
import { getActivePurchase, PLANS, type PlanKey } from "@/lib/plans";
import type { Routine, SkinProfile } from "@/lib/analysis";
import { SignOutButton } from "@/components/sign-out-button";
import { AnalysisPanel } from "@/components/analysis-panel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

function formatDate(d: Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/signin?next=${encodeURIComponent("/dashboard")}`);
  }

  const sub = await getActivePurchase(user.id);
  if (!sub) {
    return <NoPlanState />;
  }

  const planKey = (sub.plan as PlanKey) in PLANS ? (sub.plan as PlanKey) : null;
  const plan = planKey ? PLANS[planKey] : null;

  const db = getDb();
  const analyses = await db
    .select()
    .from(schema.analyses)
    .where(eq(schema.analyses.userId, user.id))
    .orderBy(desc(schema.analyses.createdAt))
    .limit(1);
  const latest = analyses[0] ?? null;

  const firstName = user.firstName?.trim() || null;

  return (
    <div className="relative">
      <div className="absolute inset-0 gradient-glow opacity-40 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-16">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="eyebrow">Dashboard</div>
            <h1 className="display text-4xl md:text-5xl mt-2 leading-[1.05]">
              {firstName ? (
                <>
                  Hi, <span className="gradient-text">{firstName}</span>.
                </>
              ) : (
                <>
                  Welcome to <span className="gradient-text">GlowVa</span>.
                </>
              )}
            </h1>
            <p className="mt-3 text-ink-soft">
              Signed in as <strong className="text-plum">{user.email}</strong>
            </p>
          </div>
          <SignOutButton />
        </div>

        {/* Plan card */}
        {plan && (
          <section className="mt-10 card p-6 md:p-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="label-cap text-coral-deep">Active plan</div>
                <div className="display text-2xl mt-1">
                  GlowVa · {plan.name}
                </div>
                <p className="mt-1 text-[13px] text-ink-mute">
                  {plan.priceLabel} · valid until{" "}
                  <strong className="text-plum">
                    {formatDate(sub.accessExpiresAt)}
                  </strong>
                </p>
                {sub.cardLast4 && (
                  <p className="mt-1 text-[12.5px] text-ink-mute inline-flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    Paid with •••• {sub.cardLast4}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/chat"
                  className="btn btn-ghost h-10 px-4 text-[13px]"
                >
                  <MessageCircle className="w-4 h-4" /> Open chat
                </Link>
                <Link
                  href="/dashboard/upload"
                  className="btn btn-glow h-10 px-4 text-[13px]"
                >
                  <Camera className="w-4 h-4" /> New analysis
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Quick links */}
        <section className="mt-6 grid sm:grid-cols-3 gap-4">
          <QuickCard
            href="/dashboard/upload"
            icon={Camera}
            title="Photo analysis"
            copy="Upload a selfie, get a routine."
          />
          <QuickCard
            href="/chat"
            icon={MessageCircle}
            title="AI coach"
            copy="Ask anything, 24/7."
          />
          <QuickCard
            href="/dashboard/history"
            icon={Zap}
            title="History"
            copy="See your past readings."
          />
        </section>

        {/* Latest analysis */}
        {!latest && (
          <section className="mt-10 card p-7 md:p-10 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-gradient-to-br from-coral-soft to-honey-soft opacity-60 blur-3xl pointer-events-none" />
            <div className="relative">
              <span className="tag-pill">
                <Sparkles className="w-3 h-3" />
                {plan?.name ?? "Plan"} active
              </span>
              <h2 className="display text-3xl md:text-4xl mt-5 leading-[1.05]">
                Run your <span className="gradient-text">first analysis</span>.
              </h2>
              <p className="mt-3 text-ink-soft leading-relaxed max-w-md">
                Upload one selfie in natural light. GlowVa reads your skin and
                builds your routine in under 10 seconds.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/upload"
                  className="btn btn-glow h-11 px-5 text-[14px]"
                >
                  <Camera className="w-4 h-4" /> Upload a photo
                </Link>
                <Link
                  href="/chat"
                  className="btn btn-ghost h-11 px-5 text-[14px]"
                >
                  <MessageCircle className="w-4 h-4" /> Open AI chat
                </Link>
              </div>
            </div>
          </section>
        )}

        {latest && (
          <section className="mt-10">
            <AnalysisPanel
              profile={latest.profile as SkinProfile}
              routine={latest.routine as Routine}
              createdAt={latest.createdAt}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/upload"
                className="btn btn-glow h-11 px-5 text-[14px]"
              >
                <Camera className="w-4 h-4" /> Re-analyze
              </Link>
              <Link
                href="/chat"
                className="btn btn-ghost h-11 px-5 text-[14px]"
              >
                <MessageCircle className="w-4 h-4" /> Ask the AI
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function QuickCard({
  href,
  icon: Icon,
  title,
  copy,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  copy: string;
}) {
  return (
    <Link
      href={href}
      className="card p-6 group hover:-translate-y-0.5 transition-transform"
    >
      <div className="w-11 h-11 rounded-2xl gradient-card flex items-center justify-center text-coral-deep">
        <Icon className="w-5 h-5" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div>
          <div className="display text-[22px] leading-tight">{title}</div>
          <div className="text-[13px] text-ink-mute mt-1">{copy}</div>
        </div>
        <ArrowRight className="w-4 h-4 text-coral-deep transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function NoPlanState() {
  return (
    <div className="relative">
      <div className="absolute inset-0 gradient-glow opacity-50 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
        <span className="tag-pill">
          <Sparkles className="w-3 h-3" />
          Pick a plan
        </span>
        <h1 className="display text-5xl md:text-6xl mt-6 leading-[0.95]">
          Pick a plan to <span className="gradient-text">unlock</span> GlowVa.
        </h1>
        <p className="mt-5 text-ink-soft leading-relaxed max-w-lg mx-auto">
          GlowVa is a one-time purchase from $2.99. Pick how long you'd like
          access for — your card is never stored for renewal.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/#pricing" className="btn btn-glow h-12 px-6 text-[14px]">
            <Sparkles className="w-4 h-4" /> See plans
          </Link>
          <Link
            href="/checkout?plan=spark"
            className="btn btn-ghost h-12 px-6 text-[14px]"
          >
            Try Spark — $2.99 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
