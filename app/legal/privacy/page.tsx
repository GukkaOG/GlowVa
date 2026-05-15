import { LegalPage } from "@/components/legal-page";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro={`Last updated: ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.`}
    >
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account info</strong> — email, first name (optional), hashed
          password.
        </li>
        <li>
          <strong>Photos you upload</strong> — processed for analysis. We
          extract a derived signature so the same photo yields the same
          analysis, then discard the raw image within 24 hours.
        </li>
        <li>
          <strong>Analysis & chat history</strong> — stored to your account so
          you can revisit it.
        </li>
        <li>
          <strong>Payment info</strong> — handled by our payment partner. We
          store only the last 4 digits and brand of your card for reference.
        </li>
      </ul>

      <h2>How we use it</h2>
      <p>
        To run the service, provide your personalized routine and AI chat,
        send account-related emails, and meet legal obligations. We do not
        sell your data.
      </p>

      <h2>Photo handling</h2>
      <p>
        Photos you upload are processed by our AI pipeline and then deleted
        within 24 hours. Only the derived metadata (skin type, hydration,
        etc.) is stored to your account. You can delete any analysis at any
        time from your dashboard.
      </p>

      <h2>Cookies</h2>
      <p>
        We use a single session cookie (`glowva_session`) to keep you signed
        in. No third-party tracking cookies.
      </p>

      <h2>Your rights</h2>
      <p>
        Access, correction, deletion, portability, opt-out — email{" "}
        <a href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a>.
        We respond within 30 days.
      </p>

      <h2>Contact</h2>
      <p>
        Data controller: {COMPANY.legalName}, {COMPANY.address.city},{" "}
        {COMPANY.address.region}, USA.
      </p>
    </LegalPage>
  );
}
