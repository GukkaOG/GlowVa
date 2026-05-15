import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Camera, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getActivePurchase } from "@/lib/plans";
import { PhotoUpload } from "./photo-upload";

export const dynamic = "force-dynamic";
export const metadata = { title: "Photo analysis" };

export default async function UploadPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/signin?next=${encodeURIComponent("/dashboard/upload")}`);
  }
  const sub = await getActivePurchase(user.id);
  if (!sub) {
    redirect("/dashboard");
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 gradient-glow opacity-40 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-6 py-10 md:py-16">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[12.5px] tracking-[0.18em] uppercase text-ink-mute hover:text-plum"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </Link>

        <div className="mt-7">
          <span className="tag-pill">
            <Camera className="w-3 h-3" />
            Photo analysis
          </span>
          <h1 className="display text-4xl md:text-5xl mt-5 leading-[1.05]">
            Upload one <span className="gradient-text">selfie</span>.
          </h1>
          <p className="mt-3 text-[15px] text-ink-soft leading-[1.7]">
            Natural light, no makeup, looking straight ahead. We process the
            photo, extract a derived skin signature, and discard the raw
            image within 24 hours.
          </p>
        </div>

        <div className="mt-8 card p-7 md:p-10">
          <PhotoUpload />

          <div className="mt-6 pt-6 border-t border-line text-[12.5px] text-ink-mute leading-[1.7]">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-coral-deep" />
            <strong>For best results:</strong> daylight, no filter, hair
            pulled back, eyes open, no smile (mouth relaxed). One face only.
          </div>
        </div>
      </div>
    </div>
  );
}
