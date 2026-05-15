import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb, schema } from "@/db/client";
import { getActivePurchase } from "@/lib/plans";
import { analyzeFromSignature, signatureFromBuffer } from "@/lib/analysis";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sub = await getActivePurchase(user.id);
  if (!sub) {
    return NextResponse.json(
      { error: "An active plan is required to run an analysis." },
      { status: 402 }
    );
  }

  const form = await req.formData();
  const photo = form.get("photo");
  if (!(photo instanceof File)) {
    return NextResponse.json(
      { error: "No photo uploaded." },
      { status: 400 }
    );
  }
  if (photo.size > 12 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large." }, { status: 400 });
  }

  const buffer = await photo.arrayBuffer();
  const signature = signatureFromBuffer(buffer);
  const { profile, routine } = analyzeFromSignature(signature);

  const db = getDb();
  const inserted = await db
    .insert(schema.analyses)
    .values({
      userId: user.id,
      profile,
      routine,
      photoSignature: signature,
    })
    .returning();

  return NextResponse.json({ ok: true, analysis: inserted[0] });
}
