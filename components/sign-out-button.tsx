"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-2 text-[13px] text-ink-mute hover:text-plum disabled:opacity-60",
        className
      )}
    >
      <LogOut className="w-3.5 h-3.5" /> {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
