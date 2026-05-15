import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";
import { getActivePurchase, PLANS, type PlanKey } from "@/lib/plans";
import type { ChatMessage } from "@/db/schema";
import { ChatRoom } from "./chat-room";

export const dynamic = "force-dynamic";
export const metadata = { title: "AI Coach" };

export default async function ChatPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/signin?next=${encodeURIComponent("/chat")}`);
  }
  const sub = await getActivePurchase(user.id);
  if (!sub) redirect("/dashboard");

  const planKey = (sub.plan as PlanKey) in PLANS ? (sub.plan as PlanKey) : null;
  const plan = planKey ? PLANS[planKey] : null;

  const db = getDb();
  const rows = (await db
    .select()
    .from(schema.chatMessages)
    .where(eq(schema.chatMessages.userId, user.id))
    .orderBy(desc(schema.chatMessages.createdAt))
    .limit(80)) as ChatMessage[];

  // Reverse to ascending order for display
  const messages = rows.slice().reverse();

  const used = messages.filter((m) => m.role === "user").length;
  const limit = plan?.chatMessagesIncluded ?? "unlimited";
  const remaining =
    limit === "unlimited" ? "unlimited" : Math.max(0, limit - used);

  return (
    <ChatRoom
      initialMessages={messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        createdAt:
          m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
      }))}
      planName={plan?.name ?? "GlowVa"}
      remaining={remaining}
      limit={limit}
    />
  );
}
