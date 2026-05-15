import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft, Camera, ScanFace } from "lucide-react";
import { getDb, schema } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";
import { getActivePurchase } from "@/lib/plans";
import type { SkinProfile } from "@/lib/analysis";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analysis history" };

function formatDate(d: Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/signin?next=${encodeURIComponent("/dashboard/history")}`);
  }
  const sub = await getActivePurchase(user.id);
  if (!sub) redirect("/dashboard");

  const db = getDb();
  const rows = await db
    .select()
    .from(schema.analyses)
    .where(eq(schema.analyses.userId, user.id))
    .orderBy(desc(schema.analyses.createdAt));

  return (
    <div className="relative">
      <div className="absolute inset-0 gradient-glow opacity-30 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-6 py-10 md:py-16">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[12.5px] tracking-[0.18em] uppercase text-ink-mute hover:text-plum"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </Link>

        <div className="mt-7">
          <div className="eyebrow">History</div>
          <h1 className="display text-4xl md:text-5xl mt-3 leading-[1.05]">
            Your <span className="gradient-text">readings</span>.
          </h1>
          <p className="mt-3 text-[15px] text-ink-soft leading-[1.7]">
            Every analysis you've run is here. Trends emerge after 3-4
            readings — try a new photo each week.
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="mt-10 card p-10 text-center">
            <div className="display text-2xl">No analyses yet.</div>
            <p className="mt-3 text-ink-soft text-[14.5px]">
              Run your first photo analysis to start tracking.
            </p>
            <Link
              href="/dashboard/upload"
              className="btn btn-glow h-11 px-5 mt-6 text-[14px]"
            >
              <Camera className="w-4 h-4" /> Upload a photo
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {rows.map((r) => {
              const p = r.profile as SkinProfile;
              return (
                <div
                  key={r.id}
                  className="card p-5 md:p-6 flex items-center gap-5"
                >
                  <div className="w-11 h-11 rounded-2xl bg-coral-soft text-coral-deep flex items-center justify-center shrink-0">
                    <ScanFace className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="display text-[20px] leading-tight">
                      {p.skinType} · {p.mainConcern}
                    </div>
                    <div className="text-[12.5px] text-ink-mute mt-1">
                      {formatDate(r.createdAt)} · Hydration {p.hydration}% ·
                      Brightness {p.brightness}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
