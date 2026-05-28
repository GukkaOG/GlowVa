import { and, desc, eq, gt } from "drizzle-orm";
import { getDb, schema } from "@/db/client";
import type { Subscription } from "@/db/schema";

// 4-tier one-time purchase plans. No auto-renewal — each purchase grants
// access until `accessExpiresAt`. Mirrors the SkinRenew flow.

export type PlanKey = "spark" | "glow" | "radiance" | "goddess";

export type Plan = {
  key: PlanKey;
  name: string;
  priceCents: number;
  priceLabel: string;
  durationDays: number;
  durationLabel: string;
  tagline: string;
  photoAnalysesIncluded: number | "unlimited";
  chatMessagesIncluded: number | "unlimited";
  featured?: boolean;
};

export const PLANS: Record<PlanKey, Plan> = {
  spark: {
    key: "spark",
    name: "Spark",
    priceCents: 299,
    priceLabel: "$2.99",
    durationDays: 1,
    durationLabel: "24 hours",
    tagline: "A first glimpse of your skin.",
    photoAnalysesIncluded: 1,
    chatMessagesIncluded: 10,
  },
  glow: {
    key: "glow",
    name: "Glow",
    priceCents: 2499,
    priceLabel: "$24.99",
    durationDays: 7,
    durationLabel: "7 days",
    tagline: "A week to find your rhythm.",
    photoAnalysesIncluded: 3,
    chatMessagesIncluded: 100,
  },
  radiance: {
    key: "radiance",
    name: "Radiance",
    priceCents: 3999,
    priceLabel: "$39.99",
    durationDays: 30,
    durationLabel: "30 days",
    tagline: "Skincare that adapts every day.",
    photoAnalysesIncluded: "unlimited",
    chatMessagesIncluded: "unlimited",
    featured: true,
  },
  goddess: {
    key: "goddess",
    name: "Goddess",
    priceCents: 6999,
    priceLabel: "$69.99",
    durationDays: 30,
    durationLabel: "30 days",
    tagline: "The full beauty lab, on demand.",
    photoAnalysesIncluded: "unlimited",
    chatMessagesIncluded: "unlimited",
  },
};

export const PLAN_KEYS: PlanKey[] = ["spark", "glow", "radiance", "goddess"];

export function isPlanKey(v: string | null | undefined): v is PlanKey {
  return v === "spark" || v === "glow" || v === "radiance" || v === "goddess";
}

export function accessExpiresFromNow(plan: PlanKey): Date {
  const days = PLANS[plan].durationDays;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function getActivePurchase(
  userId: number
): Promise<Subscription | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.subscriptions)
    .where(
      and(
        eq(schema.subscriptions.userId, userId),
        eq(schema.subscriptions.status, "active"),
        gt(schema.subscriptions.accessExpiresAt, new Date())
      )
    )
    .orderBy(desc(schema.subscriptions.createdAt))
    .limit(1);
  return rows[0] ?? null;
}

// ---------- Card validation (Luhn + format) ----------

export function luhnValid(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function detectBrand(cardNumber: string): string {
  const d = cardNumber.replace(/\D/g, "");
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "Amex";
  if (/^6(011|5)/.test(d)) return "Discover";
  return "Card";
}

// Standard test deck (Stripe / Adyen). These bypass Luhn so the demo always
// works even if the front end strips a digit. The list is small on purpose:
// we don't want to accept arbitrary made-up numbers in production.
export const TEST_CARDS: ReadonlySet<string> = new Set([
  "4242424242424242", // Visa
  "4000056655665556", // Visa debit
  "4111111111111111", // Visa generic
  "5555555555554444", // Mastercard
  "5200828282828210", // Mastercard debit
  "2223003122003222", // Mastercard 2-series
  "378282246310005", // Amex
  "371449635398431", // Amex
  "6011111111111117", // Discover
  "6011000990139424", // Discover
  "30569309025904", // Diners
  "3530111333300000", // JCB
]);

export function isTestCard(cardNumber: string): boolean {
  return TEST_CARDS.has(cardNumber.replace(/\D/g, ""));
}

export type CardValidationError =
  | "INVALID_NUMBER"
  | "INVALID_EXPIRY"
  | "EXPIRED"
  | "INVALID_CVC"
  | "INVALID_NAME";

export function validateCard(input: {
  number: string;
  exp: string;
  cvc: string;
  name: string;
}): CardValidationError | null {
  const number = input.number.replace(/\s/g, "");
  const isTest = TEST_CARDS.has(number);
  if (!isTest && !luhnValid(number)) return "INVALID_NUMBER";

  const expMatch = input.exp.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!expMatch) return "INVALID_EXPIRY";
  const month = parseInt(expMatch[1], 10);
  const year = 2000 + parseInt(expMatch[2], 10);
  if (month < 1 || month > 12) return "INVALID_EXPIRY";
  // Test cards skip the expiry-in-the-future check so "12/30" style demo
  // values keep working forever.
  if (!isTest) {
    const now = new Date();
    const cardEnd = new Date(year, month, 1);
    if (cardEnd <= now) return "EXPIRED";
  }

  if (!/^\d{3,4}$/.test(input.cvc)) return "INVALID_CVC";
  if (input.name.trim().length < 2) return "INVALID_NAME";

  return null;
}

export function cardValidationMessage(err: CardValidationError): string {
  switch (err) {
    case "INVALID_NUMBER":
      return "Invalid card number.";
    case "INVALID_EXPIRY":
      return "Invalid expiration date (MM/YY).";
    case "EXPIRED":
      return "This card is expired.";
    case "INVALID_CVC":
      return "Invalid CVC (3 or 4 digits).";
    case "INVALID_NAME":
      return "Please enter the cardholder name.";
  }
}
