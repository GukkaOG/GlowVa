import { cn } from "@/lib/utils";

type BrandSize = "sm" | "md" | "lg";

const SIZE_TOKENS: Record<
  BrandSize,
  { mark: number; text: string; gap: string }
> = {
  sm: { mark: 28, text: "text-[20px]", gap: "gap-2" },
  md: { mark: 34, text: "text-[26px]", gap: "gap-2.5" },
  lg: { mark: 44, text: "text-[34px]", gap: "gap-3" },
};

/**
 * GlowVa mark — a luminous sun-burst / petal motif. Three radiating
 * petals around a glowing core. Uses currentColor for the strokes and a
 * coral-honey gradient for the core, so it sits well on light or dark
 * surfaces.
 */
export function BrandMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="glow-core" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B8A" />
          <stop offset="100%" stopColor="#FFB547" />
        </linearGradient>
      </defs>
      {/* Outer petals */}
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M24 6 Q28 14 24 22 Q20 14 24 6 Z" />
        <path d="M42 24 Q34 28 26 24 Q34 20 42 24 Z" />
        <path d="M24 42 Q20 34 24 26 Q28 34 24 42 Z" />
        <path d="M6 24 Q14 20 22 24 Q14 28 6 24 Z" />
      </g>
      {/* Inner glow core */}
      <circle cx="24" cy="24" r="4.5" fill="url(#glow-core)" />
      <circle cx="24" cy="24" r="2" fill="#FFF7F1" />
    </svg>
  );
}

export function BrandWordmark({
  size = "md",
  className,
}: {
  size?: BrandSize;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "display leading-none whitespace-nowrap font-medium tracking-tight",
        SIZE_TOKENS[size].text,
        className,
      )}
    >
      GlowVa
    </span>
  );
}

export function BrandLockup({
  size = "md",
  className,
}: {
  size?: BrandSize;
  className?: string;
}) {
  const s = SIZE_TOKENS[size];
  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <BrandMark size={s.mark} />
      <BrandWordmark size={size} />
    </span>
  );
}
