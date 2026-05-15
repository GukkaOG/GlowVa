// Curated royalty-free imagery from Unsplash (no watermark, no attribution
// required under the Unsplash License). All on images.unsplash.com.

const ix = (url: string) =>
  url.replace(/\?.*$/, "") + "?fm=jpg&q=80&auto=format&fit=crop";

export const IMG = {
  // Glowy, luminous beauty portraits.
  glow1: ix("https://images.unsplash.com/photo-1620916566398-39f1143ab7be"),
  glow2: ix("https://images.unsplash.com/photo-1503236823255-94609f598e71"),
  glow3: ix("https://images.unsplash.com/photo-1487412947147-5cebf100ffc2"),
  glow4: ix("https://images.unsplash.com/photo-1531123897727-8f129e1688ce"),
  glow5: ix("https://images.unsplash.com/photo-1551184451-76b762941ad6"),
  glow6: ix("https://images.unsplash.com/photo-1605497788044-5a32c7078486"),

  faceCloseup: ix("https://images.unsplash.com/photo-1611310423738-75044e542a95"),
  faceNatural: ix("https://images.unsplash.com/photo-1488426862026-3ee34a7d66df"),
  faceLight: ix("https://images.unsplash.com/photo-1532074205216-d0e1f4b87368"),

  // Product / lifestyle.
  productFlat: ix("https://images.unsplash.com/photo-1556228720-195a672e8a03"),
  productSoft: ix("https://images.unsplash.com/photo-1571781926291-c477ebfd024b"),
  bathroomGlow: ix("https://images.unsplash.com/photo-1741896135490-4062a3b21abf"),

  // Hero / abstract / texture.
  flowers: ix("https://images.unsplash.com/photo-1490750967868-88aa4486c946"),
  spa: ix("https://images.unsplash.com/photo-1540555700478-4be289fbecef"),
} as const;

export type ImageKey = keyof typeof IMG;
