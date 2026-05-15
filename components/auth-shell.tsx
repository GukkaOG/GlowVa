import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { IMG } from "@/lib/images";
import { BrandLockup } from "@/components/brand";

export function AuthShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-72px)] grid lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden lg:block">
        <Image
          src={IMG.faceCloseup}
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-plum/80 via-plum/55 to-coral-deep/55"
          aria-hidden
        />
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative h-full flex flex-col justify-between p-10 xl:p-14 text-ivory">
          <Link
            href="/"
            className="inline-flex text-ivory"
            aria-label="GlowVa home"
          >
            <BrandLockup size="md" />
          </Link>

          <div className="max-w-md">
            <span className="tag-pill bg-ivory/10 text-ivory border-ivory/20">
              <Sparkles className="w-3 h-3" />
              AI beauty
            </span>
            <p className="display text-3xl xl:text-4xl mt-5 leading-[1.05]">
              One photo, your full skincare routine and an AI coach in your
              pocket.
            </p>
            <div className="mt-5 text-[13px] text-ivory/70 tracking-wide">
              One purchase from $2.99. No auto-renewal.
            </div>
          </div>

          <div className="text-[11px] text-ivory/55 tracking-[0.18em] uppercase">
            © {new Date().getFullYear()} SkinRenew LLC · DBA GlowVa · Bradenton, FL
          </div>
        </div>
      </aside>

      <div className="flex items-center justify-center px-6 py-12 md:py-16 bg-blush relative overflow-hidden">
        <div className="absolute inset-0 gradient-glow opacity-60 pointer-events-none" />
        <div className="relative w-full max-w-md">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="display text-4xl md:text-5xl mt-3 leading-[1.05]">
            {title}
          </h1>
          {intro && (
            <p className="mt-4 text-ink-soft leading-relaxed">{intro}</p>
          )}
          <div className="mt-9 card p-7">{children}</div>
          {footer && (
            <div className="mt-6 text-center text-[13.5px] text-ink-soft">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AuthLinkRow({
  prompt,
  href,
  cta,
}: {
  prompt: string;
  href: string;
  cta: string;
}) {
  return (
    <div>
      {prompt}{" "}
      <Link
        href={href}
        className="text-coral-deep font-medium underline underline-offset-2 hover:text-plum"
      >
        {cta}
      </Link>
    </div>
  );
}
