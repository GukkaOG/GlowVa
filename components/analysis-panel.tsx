import { Calendar, Droplets, Moon, ScanFace, Sparkles, Sun } from "lucide-react";
import type { Routine, RoutineStep, SkinProfile } from "@/lib/analysis";

function formatDate(d: Date | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AnalysisPanel({
  profile,
  routine,
  createdAt,
}: {
  profile: SkinProfile;
  routine: Routine;
  createdAt: Date | string;
}) {
  return (
    <section className="space-y-6">
      <div className="card p-7 md:p-9 relative overflow-hidden">
        <div className="absolute -top-16 -right-12 w-72 h-72 rounded-full bg-gradient-to-br from-coral-soft to-honey-soft opacity-50 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="label-cap text-coral-deep">Skin reading</div>
              <h2 className="display text-3xl md:text-4xl mt-2 leading-[1.05]">
                {profile.skinType} skin ·{" "}
                <span className="gradient-text">{profile.mainConcern}</span>
              </h2>
              <p className="mt-2 text-[13px] text-ink-mute">
                Generated on {formatDate(new Date(createdAt))} · secondary:{" "}
                {profile.secondaryConcerns.join(", ")}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral to-honey text-ivory flex items-center justify-center shrink-0 shadow-[var(--shadow-glow)]">
              <ScanFace className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Metric
              label="Hydration"
              value={`${profile.hydration}%`}
              icon={Droplets}
            />
            <Metric
              label="Brightness"
              value={`${profile.brightness}%`}
              icon={Sparkles}
            />
            <Metric label="Oiliness" value={profile.oiliness} />
            <Metric label="Sensitivity" value={profile.sensitivity} />
          </div>

          {profile.notes.length > 0 && (
            <ul className="mt-7 space-y-2.5 text-[14px] text-ink-soft">
              {profile.notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span className="text-coral-deep mt-1 text-[18px] leading-none">
                    ·
                  </span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <RoutineBlock
          title="Morning routine"
          icon={<Sun className="w-4 h-4" />}
          steps={routine.morning}
        />
        <RoutineBlock
          title="Evening routine"
          icon={<Moon className="w-4 h-4" />}
          steps={routine.evening}
        />
      </div>

      {routine.weekly.length > 0 && (
        <RoutineBlock
          title="Weekly rituals"
          icon={<Calendar className="w-4 h-4" />}
          steps={routine.weekly}
        />
      )}

      <div className="card p-6 md:p-7 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-coral to-honey text-ivory flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-[14px] leading-relaxed text-ink-soft">
          <div className="font-medium text-plum">GlowVa AI · Coach tip</div>
          <p className="mt-1">{routine.coachTip}</p>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-cream/60 border border-line rounded-2xl px-4 py-3.5">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3 text-coral-deep" />}
        <div className="text-[10px] uppercase tracking-[0.16em] text-ink-mute font-semibold">
          {label}
        </div>
      </div>
      <div className="display text-[22px] mt-1 leading-none">{value}</div>
    </div>
  );
}

function RoutineBlock({
  title,
  icon,
  steps,
}: {
  title: string;
  icon: React.ReactNode;
  steps: RoutineStep[];
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-2xl bg-coral-soft text-coral-deep flex items-center justify-center">
          {icon}
        </span>
        <h3 className="display text-[22px]">{title}</h3>
      </div>
      <ul className="mt-5 space-y-3.5">
        {steps.map((s, i) => (
          <li key={`${s.step}-${i}`} className="flex gap-3">
            <span className="text-[11px] tracking-[0.18em] text-coral-deep font-semibold pt-0.5 w-9 shrink-0">
              {s.step}
            </span>
            <div className="flex-1">
              <div className="text-[14.5px] text-plum leading-snug">
                {s.product}
              </div>
              {s.hint && (
                <div className="text-[12.5px] text-ink-mute mt-0.5">
                  {s.hint}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
