"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Loader2,
  Send,
  Sparkles,
  User,
} from "lucide-react";

type Msg = {
  id: number | string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

const SUGGESTIONS = [
  "What's the right order for my morning routine?",
  "Can I use retinol if my skin is sensitive?",
  "How do I deal with sudden breakouts?",
  "Is hyaluronic acid OK to layer with vitamin C?",
];

export function ChatRoom({
  initialMessages,
  planName,
  remaining,
  limit,
}: {
  initialMessages: Msg[];
  planName: string;
  remaining: number | "unlimited";
  limit: number | "unlimited";
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingLocal, setRemainingLocal] = useState<number | "unlimited">(
    remaining
  );
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setError(null);
    if (remainingLocal !== "unlimited" && remainingLocal <= 0) {
      setError("You've used all chat messages for this plan. Upgrade to keep chatting.");
      return;
    }

    const tempId = `tmp-${Date.now()}`;
    const userMsg: Msg = {
      id: tempId,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setMessages((prev) => [
        ...prev,
        {
          id: data.assistantId ?? `a-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          createdAt: new Date().toISOString(),
        },
      ]);
      if (typeof data.remaining === "number" || data.remaining === "unlimited") {
        setRemainingLocal(data.remaining);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
      // Remove the optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="relative h-[calc(100vh-72px)] flex flex-col">
      <div className="absolute inset-0 gradient-glow opacity-25 pointer-events-none" />

      {/* Header */}
      <div className="relative border-b border-line bg-blush/85 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[12.5px] tracking-[0.18em] uppercase text-ink-mute hover:text-plum"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-2xl bg-gradient-to-br from-coral to-honey text-ivory flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="font-semibold text-[13.5px] leading-none text-plum">
                GlowVa AI Coach
              </div>
              <div className="text-[10.5px] tracking-[0.18em] uppercase text-ink-mute mt-0.5">
                {planName}
                {limit !== "unlimited" && (
                  <>
                    {" "}
                    ·{" "}
                    {typeof remainingLocal === "number"
                      ? `${remainingLocal} left`
                      : remainingLocal}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="w-[80px]" aria-hidden />
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-8 space-y-5">
          {messages.length === 0 && (
            <div className="card p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-coral to-honey text-ivory flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="display text-3xl mt-5 leading-tight">
                Hi, I'm <span className="gradient-text">GlowVa</span>.
              </h2>
              <p className="mt-3 text-ink-soft text-[14.5px] leading-[1.7] max-w-md mx-auto">
                Ask me anything about your skin, ingredients, layering or
                product picks. I won't sell you anything — I'll just help.
              </p>
              <div className="mt-7 grid sm:grid-cols-2 gap-2.5 max-w-lg mx-auto text-left">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[13px] px-4 py-3 rounded-2xl border border-line bg-cream/40 hover:border-coral hover:bg-coral-soft/30 transition-colors text-ink-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <Bubble key={m.id} message={m} />
          ))}

          {sending && (
            <Bubble
              message={{
                id: "loading",
                role: "assistant",
                content: "…",
                createdAt: new Date().toISOString(),
              }}
              loading
            />
          )}

          <div ref={endRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="relative border-t border-line bg-ivory/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-4">
          {error && (
            <div className="mb-3 text-[13px] text-coral-deep bg-coral-soft/40 border border-coral-soft rounded-xl px-3 py-2">
              {error}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <Link
              href="/dashboard/upload"
              className="shrink-0 w-11 h-11 rounded-2xl border border-line-strong bg-cream/40 hover:bg-coral-soft/40 hover:border-coral text-ink-mute hover:text-coral-deep transition-colors flex items-center justify-center"
              title="Run a new photo analysis"
            >
              <Camera className="w-4 h-4" />
            </Link>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Ask the AI coach anything…"
                className="input resize-none min-h-[44px] max-h-[160px] pr-12"
              />
            </div>
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="shrink-0 w-11 h-11 rounded-2xl btn-glow flex items-center justify-center disabled:opacity-50"
              aria-label="Send"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
          <div className="mt-2 text-[11px] text-ink-mute text-center">
            GlowVa is an AI assistant, not a medical device. For
            conditions, see a dermatologist.
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  message,
  loading,
}: {
  message: Msg;
  loading?: boolean;
}) {
  const isUser = message.role === "user";
  return (
    <div
      className={[
        "flex gap-3 items-start",
        isUser ? "flex-row-reverse" : "flex-row",
      ].join(" ")}
    >
      <div
        className={[
          "shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center",
          isUser
            ? "bg-plum text-ivory"
            : "bg-gradient-to-br from-coral to-honey text-ivory shadow-[var(--shadow-glow)]",
        ].join(" ")}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>
      <div
        className={[
          "rounded-3xl px-4 py-3 max-w-[78%] leading-[1.6] text-[14.5px]",
          isUser
            ? "bg-plum text-ivory rounded-tr-md"
            : "bg-ivory border border-line text-plum rounded-tl-md shadow-[var(--shadow-card)]",
        ].join(" ")}
      >
        {loading ? (
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-coral animate-bounce" />
            <span
              className="w-1.5 h-1.5 rounded-full bg-coral animate-bounce"
              style={{ animationDelay: "0.15s" }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-coral animate-bounce"
              style={{ animationDelay: "0.3s" }}
            />
          </span>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}
