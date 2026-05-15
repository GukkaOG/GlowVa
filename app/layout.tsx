import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://glowva.com"
).replace(/\/$/, "");

const SHORT_DESC =
  "AI-powered beauty analysis. Upload a photo, get a personalized skincare routine + unlimited chat advice from your beauty coach.";

const FULL_DESC = `${SHORT_DESC} One-time purchase from $2.99. No subscriptions.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GlowVa — AI beauty, made for your skin.",
    template: "%s · GlowVa",
  },
  description: FULL_DESC,
  applicationName: "GlowVa",
  authors: [{ name: "GlowVa" }],
  creator: "GlowVa",
  publisher: "GlowVa",
  keywords: [
    "GlowVa",
    "AI skincare",
    "AI beauty",
    "photo skin analysis",
    "personalized skincare routine",
    "skincare coach",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "GlowVa",
    title: "GlowVa — AI beauty, made for your skin.",
    description: SHORT_DESC,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlowVa — AI beauty, made for your skin.",
    description: SHORT_DESC,
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Nav
          user={
            user
              ? { firstName: user.firstName ?? null, email: user.email }
              : null
          }
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
