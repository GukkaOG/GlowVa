import { NextResponse } from "next/server";
import { and, count, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { getDb, schema } from "@/db/client";
import { getActivePurchase, PLANS, type PlanKey } from "@/lib/plans";
import { generateCoachReply } from "@/lib/coach";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sub = await getActivePurchase(user.id);
  if (!sub) {
    return NextResponse.json(
      { error: "An active plan is required to chat." },
      { status: 402 }
    );
  }

  const body = (await req.json().catch(() => null)) as {
    message?: string;
  } | null;
  const message = (body?.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "Message is empty." }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json(
      { error: "Message is too long (max 2000 characters)." },
      { status: 400 }
    );
  }

  const planKey = (sub.plan as PlanKey) in PLANS ? (sub.plan as PlanKey) : null;
  const plan = planKey ? PLANS[planKey] : null;
  const limit = plan?.chatMessagesIncluded ?? 10;

  const db = getDb();

  if (limit !== "unlimited") {
    const [{ value }] = (await db
      .select({ value: count() })
      .from(schema.chatMessages)
      .where(
        and(
          eq(schema.chatMessages.userId, user.id),
          eq(schema.chatMessages.role, "user")
        )
      )) as { value: number }[];
    if (value >= limit) {
      return NextResponse.json(
        {
          error:
            "You've reached your chat message limit for this plan. Upgrade to keep chatting.",
        },
        { status: 429 }
      );
    }
  }

  // Insert user message
  await db.insert(schema.chatMessages).values({
    userId: user.id,
    role: "user",
    content: message,
  });

  const reply = generateCoachReply(message);

  const inserted = await db
    .insert(schema.chatMessages)
    .values({
      userId: user.id,
      role: "assistant",
      content: reply,
    })
    .returning();

  let remaining: number | "unlimited" = "unlimited";
  if (limit !== "unlimited") {
    const [{ value }] = (await db
      .select({ value: count() })
      .from(schema.chatMessages)
      .where(
        and(
          eq(schema.chatMessages.userId, user.id),
          eq(schema.chatMessages.role, "user")
        )
      )) as { value: number }[];
    remaining = Math.max(0, limit - value);
  }

  return NextResponse.json({
    ok: true,
    reply,
    assistantId: inserted[0]?.id,
    remaining,
  });
}
