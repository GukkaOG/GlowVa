// Legal entity (SkinRenew LLC) unchanged. Trading brand: GlowVa.
export const COMPANY = {
  legalName: "SkinRenew LLC",
  dba: "GlowVa",
  brand: "GlowVa",
  tagline: "AI-powered beauty, made for your skin.",
  state: "Wyoming",
  address: {
    line1: "1831 13th Ave E, APT 1323",
    city: "Bradenton",
    region: "FL",
    postalCode: "34208",
    country: "United States",
  },
  email: "support@glow-va.com",
  supportEmail: "support@glow-va.com",
  privacyEmail: "support@glow-va.com",
  phone: "+1 (941) 396-3182",
  phoneTel: "+19413963182",
  supportHours: "Monday – Friday, 9am – 6pm ET",
  statementDescriptor: "GLOWVA",
} as const;

export const COMPANY_ADDRESS_INLINE = `${COMPANY.legalName}, ${COMPANY.address.line1}, ${COMPANY.address.city}, ${COMPANY.address.region} ${COMPANY.address.postalCode}, ${COMPANY.address.country}`;
