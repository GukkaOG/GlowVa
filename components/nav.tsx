"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Sparkles, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLockup } from "@/components/brand";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

type NavUser = { firstName: string | null; email: string } | null;

export function Nav({ user }: { user: NavUser }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-blush/80 backdrop-blur-md border-b border-line"
          : "bg-blush/0 border-b border-transparent"
      )}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between">
        <Link
          href="/"
          aria-label="GlowVa home"
          className="group text-plum transition-transform hover:-translate-y-px"
        >
          <BrandLockup size="sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13.5px] font-medium text-ink-soft hover:text-plum transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="btn btn-ghost h-10 px-4 text-[13px]"
            >
              <User className="w-3.5 h-3.5" /> Dashboard
            </Link>
          ) : (
            <Link
              href="/signin"
              className="text-[13.5px] font-medium text-ink-soft hover:text-plum"
            >
              Sign in
            </Link>
          )}
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="btn btn-glow h-10 px-5 text-[13px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {user ? "Open app" : "Try GlowVa"}
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-full hover:bg-cream transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-blush">
          <nav className="px-6 py-6 flex flex-col gap-4" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="display text-[28px] leading-tight"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-line flex flex-col gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="btn btn-ghost h-11"
                >
                  <User className="w-4 h-4" /> Dashboard
                </Link>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className="btn btn-ghost h-11"
                >
                  Sign in
                </Link>
              )}
              <Link
                href={user ? "/dashboard" : "/signup"}
                onClick={() => setOpen(false)}
                className="btn btn-glow h-11"
              >
                <Sparkles className="w-4 h-4" />
                {user ? "Open app" : "Try GlowVa"}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
