import { NextResponse } from "next/server";
import {
  findUserByEmail,
  generateToken,
  normalizeEmail,
  validateEmail,
} from "@/lib/auth";
import { getDb, schema } from "@/db/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = body.email ? normalizeEmail(body.email) : "";
    const emailError = validateEmail(email);
    if (emailError)
      return NextResponse.json({ error: emailError }, { status: 400 });

    // Always respond OK to avoid email enumeration.
    const user = await findUserByEmail(email);
    if (user) {
      const db = getDb();
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h
      await db.insert(schema.passwordResets).values({
        token,
        userId: user.id,
        expiresAt,
      });
      // In production: send a reset email here with the token-based link.
      // For now we just log it server-side so the dev can copy/paste.
      console.log(
        `[glowva] password reset link: /reset-password?token=${token}`
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
