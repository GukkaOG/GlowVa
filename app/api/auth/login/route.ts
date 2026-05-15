import { NextResponse } from "next/server";
import {
  findUserByEmail,
  normalizeEmail,
  setSessionCookie,
  signSession,
  touchLastLogin,
  validateEmail,
  verifyPassword,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const email = body.email ? normalizeEmail(body.email) : "";
    const password = body.password ?? "";

    const emailError = validateEmail(email);
    if (emailError)
      return NextResponse.json({ error: emailError }, { status: 400 });
    if (!password)
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Wrong email or password." },
        { status: 401 }
      );
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Wrong email or password." },
        { status: 401 }
      );
    }

    const jwt = await signSession({ userId: user.id, email: user.email });
    await setSessionCookie(jwt);
    await touchLastLogin(user.id);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
