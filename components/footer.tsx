import Link from "next/link";
import { Mail, Sparkles } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { BrandLockup } from "@/components/brand";

export function Footer() {
  return (
    <footer className="bg-plum text-ivory mt-0">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-20 md:py-24">
        <div className="grid gap-12 md:gap-16 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex text-ivory"
              aria-label="GlowVa home"
            >
              <BrandLockup size="lg" />
            </Link>
            <p className="mt-6 max-w-sm text-[14px] text-ivory/70 leading-[1.7]">
              AI-powered beauty analysis. Upload a photo, get a personalized
              skincare routine and chat with your beauty AI coach. One
              purchase, no auto-renewal.
            </p>

            <div className="mt-8 space-y-1.5 text-[13px] text-ivory/75">
              <a
                href={`mailto:${COMPANY.supportEmail}`}
                className="inline-flex items-center gap-2 hover:text-ivory"
              >
                <Mail className="w-3.5 h-3.5" /> {COMPANY.supportEmail}
              </a>
            </div>
          </div>

          <FooterColumn
            title="Product"
            items={[
              { href: "/#how-it-works", label: "How it works" },
              { href: "/#features", label: "Features" },
              { href: "/#pricing", label: "Pricing" },
              { href: "/#faq", label: "FAQ" },
            ]}
          />
          <FooterColumn
            title="Account"
            items={[
              { href: "/signup", label: "Create account" },
              { href: "/signin", label: "Sign in" },
              { href: "/dashboard", label: "Dashboard" },
            ]}
          />
          <FooterColumn
            title="Legal"
            items={[
              { href: "/legal/terms", label: "Terms of Service" },
              { href: "/legal/privacy", label: "Privacy Policy" },
              { href: "/legal/refunds", label: "Refund Policy" },
              { href: "/legal/contact", label: "Contact" },
            ]}
          />
        </div>

        <div className="mt-20 pt-8 border-t border-ivory/15 grid md:grid-cols-2 gap-6 text-[11.5px] tracking-[0.16em] uppercase text-ivory/55 leading-relaxed">
          <div>
            © {new Date().getFullYear()} {COMPANY.legalName} · DBA {COMPANY.dba} ·
            Registered in {COMPANY.state}, USA
          </div>
          <div className="md:text-right">
            {COMPANY.address.line1}, {COMPANY.address.city},{" "}
            {COMPANY.address.region} {COMPANY.address.postalCode}
          </div>
        </div>

        <div className="mt-10 display text-[44px] md:text-[68px] leading-none text-ivory/10 select-none flex items-center gap-4">
          <Sparkles className="w-8 h-8" aria-hidden />
          AI beauty, made for your skin.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-ivory/55 font-semibold">
        {title}
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="text-[14px] text-ivory/80 hover:text-ivory transition-colors"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
