import { LegalPage } from "@/components/legal-page";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "Refund Policy" };

export default function RefundsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund Policy"
      intro="If GlowVa isn't a fit, we want your money back too."
    >
      <h2>14-day guarantee</h2>
      <p>
        Every plan comes with a 14-day money-back guarantee, no questions
        asked. If you're not happy with GlowVa within 14 days of purchase,
        email us and we'll refund the full amount.
      </p>

      <h2>How to request</h2>
      <p>
        Send an email from your account address to{" "}
        <a href={`mailto:${COMPANY.supportEmail}`}>{COMPANY.supportEmail}</a>{" "}
        with the subject <strong>Refund</strong>. Mention your plan and the
        date of purchase. We process refunds within 3 business days.
      </p>

      <h2>What's not refundable</h2>
      <ul>
        <li>Purchases older than 14 days.</li>
        <li>Charges already credited to another refund.</li>
      </ul>

      <h2>Charge descriptor</h2>
      <p>
        Charges appear on your statement as{" "}
        <strong>{COMPANY.statementDescriptor}</strong>. If you see an
        unexpected charge, email us first — we'll sort it out faster than a
        chargeback can.
      </p>
    </LegalPage>
  );
}
