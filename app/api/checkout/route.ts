import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb, schema } from "@/db/client";
import {
  accessExpiresFromNow,
  cardValidationMessage,
  detectBrand,
  getActivePurchase,
  isPlanKey,
  PLANS,
  validateCard,
} from "@/lib/plans";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    plan?: string;
    cardNumber?: string;
    cardExp?: string;
    cardCvc?: string;
    cardName?: string;
  } | null;

  const rawPlan = body?.plan ?? "";
  if (!isPlanKey(rawPlan)) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }

  const existing = await getActivePurchase(user.id);
  if (existing) {
    return NextResponse.json(
      {
        error:
          "You already have active access. Wait until it expires or contact support.",
        accessExpiresAt: existing.accessExpiresAt,
      },
      { status: 409 }
    );
  }

  const cardError = validateCard({
    number: body?.cardNumber ?? "",
    exp: body?.cardExp ?? "",
    cvc: body?.cardCvc ?? "",
    name: body?.cardName ?? "",
  });
  if (cardError) {
    return NextResponse.json(
      { error: cardValidationMessage(cardError) },
      { status: 400 }
    );
  }

  const planConfig = PLANS[rawPlan];
  const cardNumber = (body?.cardNumber ?? "").replace(/\s/g, "");
  const last4 = cardNumber.slice(-4);
  const brand = detectBrand(cardNumber);

  const db = getDb();
  const inserted = await db
    .insert(schema.subscriptions)
    .values({
      userId: user.id,
      plan: rawPlan,
      status: "active",
      intervalDays: planConfig.durationDays,
      pricePerCycleCents: planConfig.priceCents,
      currency: "USD",
      accessExpiresAt: accessExpiresFromNow(rawPlan),
      cardLast4: last4,
      cardBrand: brand,
    })
    .returning();

  return NextResponse.json({ ok: true, purchase: inserted[0] });
}
