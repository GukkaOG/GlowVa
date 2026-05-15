import Link from "next/link";
import { Mail } from "lucide-react";
import { LegalPage } from "@/components/legal-page";
import { COMPANY } from "@/lib/company";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="Contact"
      title="Reach a human."
      intro="Email is the fastest way. We answer within one business day."
    >
      <h2>General & support</h2>
      <p>
        <a href={`mailto:${COMPANY.supportEmail}`}>
          <Mail className="inline w-4 h-4 mr-1.5" />
          {COMPANY.supportEmail}
        </a>
      </p>

      <h2>Privacy & data requests</h2>
      <p>
        <a href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a>
      </p>

      <h2>Mailing address</h2>
      <p>
        {COMPANY.legalName} (DBA {COMPANY.dba})<br />
        {COMPANY.address.line1}
        <br />
        {COMPANY.address.city}, {COMPANY.address.region}{" "}
        {COMPANY.address.postalCode}
        <br />
        {COMPANY.address.country}
      </p>

      <h2>Hours</h2>
      <p>{COMPANY.supportHours}.</p>

      <p>
        Looking for plans? <Link href="/#pricing">See pricing</Link>.
      </p>
    </LegalPage>
  );
}
