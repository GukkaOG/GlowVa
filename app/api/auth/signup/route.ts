import { NextResponse } from "next/server";
import {
  createUser,
  findUserByEmail,
  normalizeEmail,
  setSessionCookie,
  signSession,
  validateEmail,
  validatePassword,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email?: string;
      password?: string;
      firstName?: string;
      marketingOptIn?: boolean;
    };

    const email = body.email ? normalizeEmail(body.email) : "";
    const password = body.password ?? "";

    const emailError = validateEmail(email);
    if (emailError)
      return NextResponse.json({ error: emailError }, { status: 400 });
    const passwordError = validatePassword(password);
    if (passwordError)
      return NextResponse.json({ error: passwordError }, { status: 400 });

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists. Sign in instead.",
        },
        { status: 409 }
      );
    }

    const user = await createUser({
      email,
      password,
      firstName: body.firstName?.trim() || null,
      marketingOptIn: !!body.marketingOptIn,
    });

    const jwt = await signSession({ userId: user.id, email: user.email });
    await setSessionCookie(jwt);

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
