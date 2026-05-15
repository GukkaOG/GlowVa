import { LegalPage } from "@/components/legal-page";
import { COMPANY, COMPANY_ADDRESS_INLINE } from "@/lib/company";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro={`Last updated: ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.`}
    >
      <h2>1. Who we are</h2>
      <p>
        GlowVa is operated by <strong>{COMPANY.legalName}</strong>, registered
        in {COMPANY.state}, USA, doing business as {COMPANY.dba} ({COMPANY_ADDRESS_INLINE}).
        References to "we", "us" or "GlowVa" mean {COMPANY.legalName}.
      </p>

      <h2>2. The service</h2>
      <p>
        GlowVa is an AI-powered beauty assistant. The service includes photo
        skin analysis, personalized skincare routine generation, and an AI
        chat coach. Output is informational, not medical advice.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least 16 years old to use GlowVa. By creating an
        account you confirm that you meet this age requirement.
      </p>

      <h2>4. Account</h2>
      <p>
        You are responsible for the activity on your account. Keep your
        password confidential. Notify us at {COMPANY.supportEmail} if you
        suspect unauthorized access.
      </p>

      <h2>5. Payment</h2>
      <p>
        All plans are one-time purchases. Your card is not stored for
        renewal. Access ends on the expiration date for your plan. Charges
        appear on your statement as <strong>{COMPANY.statementDescriptor}</strong>.
      </p>

      <h2>6. Refunds</h2>
      <p>
        14-day money-back guarantee on every plan. See our{" "}
        <a href="/legal/refunds">Refund Policy</a>.
      </p>

      <h2>7. Medical disclaimer</h2>
      <p>
        GlowVa is not a medical device. It does not diagnose, treat, cure or
        prevent any disease. If you have a skin condition, consult a
        dermatologist. Stop using any product that causes a reaction.
      </p>

      <h2>8. AI accuracy</h2>
      <p>
        Our AI is built on dermatology literature but can be wrong. Use your
        own judgment. Don't make medical decisions based on GlowVa output.
      </p>

      <h2>9. Acceptable use</h2>
      <ul>
        <li>Don't upload photos of anyone other than yourself.</li>
        <li>Don't attempt to reverse-engineer or scrape the service.</li>
        <li>Don't use GlowVa for any unlawful purpose.</li>
      </ul>

      <h2>10. Contact</h2>
      <p>
        Questions: <a href={`mailto:${COMPANY.supportEmail}`}>{COMPANY.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
