import Link from "next/link";

export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <Link
        href="/"
        className="text-[12px] tracking-[0.18em] uppercase text-ink-mute hover:text-plum"
      >
        ← Back home
      </Link>
      <div className="mt-8">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="display mt-3 text-4xl md:text-5xl leading-[1.05]">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 text-ink-soft text-[15px] leading-[1.7]">
            {intro}
          </p>
        )}
      </div>

      <article className="mt-10 prose-glowva">{children}</article>

      <style>{`
        .prose-glowva h2 {
          font-family: var(--font-display);
          font-size: 1.65rem;
          margin-top: 2.5rem;
          margin-bottom: 0.6rem;
          line-height: 1.2;
        }
        .prose-glowva h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          margin-top: 1.7rem;
          margin-bottom: 0.4rem;
        }
        .prose-glowva p { font-size: 15px; line-height: 1.75; color: var(--color-ink-soft); margin-top: 0.8rem; }
        .prose-glowva ul { list-style: disc; margin-left: 1.2rem; margin-top: 0.5rem; font-size: 15px; color: var(--color-ink-soft); }
        .prose-glowva li { margin-top: 0.35rem; }
        .prose-glowva a { color: var(--color-coral-deep); text-decoration: underline; }
        .prose-glowva strong { color: var(--color-plum); font-weight: 600; }
      `}</style>
    </div>
  );
}
