"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Camera, Loader2, Sparkles, Upload, X } from "lucide-react";

export function PhotoUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState<
    "idle" | "analyzing" | "saving" | "done"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  function handleFile(f: File | null) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image (JPG, PNG, HEIC).");
      return;
    }
    if (f.size > 12 * 1024 * 1024) {
      setError("Image is too large (max 12 MB).");
      return;
    }
    setError(null);
    setFile(f);
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }

  function clear() {
    setPreview(null);
    setFileName(null);
    setFile(null);
    setError(null);
    setStage("idle");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function analyze() {
    if (!file) return;
    setError(null);
    setStage("analyzing");
    try {
      // Add a small artificial delay so the staged UI feels real.
      await new Promise((r) => setTimeout(r, 1200));
      setStage("saving");
      const fd = new FormData();
      fd.append("photo", file);
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setStage("done");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStage("idle");
    }
  }

  if (preview) {
    return (
      <div>
        <div className="relative image-frame aspect-[4/5] max-w-md mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Selected selfie"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {stage === "analyzing" || stage === "saving" ? (
            <div className="absolute inset-0 bg-plum/55 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-ivory/95 rounded-2xl px-5 py-4 flex items-center gap-3 max-w-[280px]">
                <Loader2 className="w-5 h-5 text-coral-deep animate-spin" />
                <div className="text-[13px]">
                  <div className="font-semibold text-plum">
                    {stage === "analyzing"
                      ? "Reading your skin…"
                      : "Building your routine…"}
                  </div>
                  <div className="text-ink-mute mt-0.5">
                    {stage === "analyzing"
                      ? "Mapping hydration, tone, sensitivity"
                      : "Saving to your dashboard"}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {fileName && (
          <div className="mt-3 flex items-center justify-between text-[12.5px] text-ink-mute">
            <span className="truncate max-w-[60%]">{fileName}</span>
            <button
              type="button"
              onClick={clear}
              disabled={stage !== "idle"}
              className="inline-flex items-center gap-1 hover:text-plum"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 text-[13px] text-coral-deep bg-coral-soft/40 border border-coral-soft rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={analyze}
          disabled={stage !== "idle"}
          className="btn btn-glow w-full h-12 mt-5 disabled:opacity-60"
        >
          {stage !== "idle" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Run analysis
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={[
          "w-full rounded-3xl border-2 border-dashed transition-all duration-200 px-6 py-12 md:py-16 flex flex-col items-center text-center",
          dragging
            ? "border-coral bg-coral-soft/30"
            : "border-line-strong bg-cream/50 hover:border-coral hover:bg-coral-soft/20",
        ].join(" ")}
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral to-honey text-ivory flex items-center justify-center shadow-[var(--shadow-glow)]">
          <Upload className="w-6 h-6" />
        </div>
        <div className="display text-2xl md:text-[28px] mt-5 leading-tight">
          Drop a selfie here
        </div>
        <div className="text-[13.5px] text-ink-mute mt-2">
          JPG, PNG, HEIC — up to 12 MB
        </div>
        <div className="mt-5 inline-flex items-center gap-2 text-[12.5px] text-coral-deep font-medium">
          <Camera className="w-3.5 h-3.5" /> or click to choose a file
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {error && (
        <div className="mt-4 text-[13px] text-coral-deep bg-coral-soft/40 border border-coral-soft rounded-xl px-3 py-2">
          {error}
        </div>
      )}
    </div>
  );
}
