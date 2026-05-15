// Deterministic mocked AI coach. Maps user messages to topical replies so
// the chat feels real without any external LLM dependency. Easy to swap for
// a real model later: just replace `generateCoachReply` with an API call.

type Topic =
  | "greeting"
  | "acne"
  | "retinol"
  | "vitaminC"
  | "spf"
  | "hyaluronic"
  | "niacinamide"
  | "dryness"
  | "oiliness"
  | "sensitive"
  | "redness"
  | "dark_spots"
  | "fine_lines"
  | "routine_order"
  | "ingredient_question"
  | "product_pick"
  | "default";

function classify(message: string): Topic {
  const m = message.toLowerCase();
  if (/^(hi|hello|hey|salut|bonjour)\b/.test(m)) return "greeting";
  if (/(acne|pimple|breakout|whitehead|blackhead|spot)/.test(m)) return "acne";
  if (/(retinol|retinoid|tretinoin|retin-a)/.test(m)) return "retinol";
  if (/(vitamin\s?c|ascorbic|ascorbate)/.test(m)) return "vitaminC";
  if (/(spf|sunscreen|sun protection|uv)/.test(m)) return "spf";
  if (/(hyaluronic|ha\b|hyaluron)/.test(m)) return "hyaluronic";
  if (/(niacinamide|vitamin\s?b3)/.test(m)) return "niacinamide";
  if (/(dry|dehydrated|tight|flak)/.test(m)) return "dryness";
  if (/(oily|sebum|shine|greasy|t-zone)/.test(m)) return "oiliness";
  if (/(sensitive|reactive|sting|burn)/.test(m)) return "sensitive";
  if (/(red(ness)?|rosacea|irritat)/.test(m)) return "redness";
  if (/(dark\s?spot|pigment|melasma|tone|brown)/.test(m)) return "dark_spots";
  if (/(wrinkle|fine line|aging|aging)/.test(m)) return "fine_lines";
  if (/(order|layer|first|before|after|sequence)/.test(m))
    return "routine_order";
  if (/(what\s+(is|does)|ingredient|comedogenic|safe)/.test(m))
    return "ingredient_question";
  if (/(recommend|brand|product|pick|which one|best)/.test(m))
    return "product_pick";
  return "default";
}

const REPLIES: Record<Topic, string[]> = {
  greeting: [
    "Hey ✨ — I'm GlowVa, your AI beauty coach. Ask me anything about your skin, ingredients, layering or product picks.",
    "Hi! What can I help you with today — a routine question, an ingredient deep-dive, or troubleshooting a reaction?",
  ],
  acne: [
    "For breakouts: salicylic acid 0.5–2% on affected zones only (not the whole face), at night. Pair with a gentle pH 5.5 cleanser and a non-comedogenic moisturizer. Skip oils until things calm down. Don't introduce niacinamide and BHA on the same week — pick one for now.",
  ],
  retinol: [
    "Retinol is one of the best-studied anti-aging actives, but it earns its place slowly. Start with encapsulated retinol 0.3% **two nights a week**, in a moisturizer sandwich (cream → retinol → cream). Build up to 3–4 nights over 2 months. Always SPF 50 in the morning.",
  ],
  vitaminC: [
    "Vitamin C is best in the morning, on clean skin, before moisturizer and SPF. 10% L-ascorbic acid is a strong starting point. Store it in a dark bottle and toss it if it turns orange — that means it's oxidized. Skip the same morning as exfoliating acids.",
  ],
  spf: [
    "SPF 50, mineral or chemical, every morning — yes, even indoors and on cloudy days. Two fingers' worth for the face and neck. Reapply every 2 hours if you're outside. Non-comedogenic if you're acne-prone. This is the single most impactful step in any routine.",
  ],
  hyaluronic: [
    "Hyaluronic acid: apply to **damp** skin (after cleanser, before moisturizer), then seal with a cream. On dry skin in dry air it can actually pull moisture *out* of your skin. 3 molecular weights is ideal — surface hydration + deep plumping.",
  ],
  niacinamide: [
    "Niacinamide 5% is one of the safest, most versatile actives. Calms reactivity, evens tone, regulates sebum. Works AM or PM, plays well with almost everything except high-dose vitamin C (use them at separate times of day).",
  ],
  dryness: [
    "Dry vs. dehydrated matters. Dry = lacks oil — needs ceramides + occlusives. Dehydrated = lacks water — needs humectants (hyaluronic acid, glycerin) under a moisturizer. Layer humectant on damp skin, then cream. Skip foaming cleansers for 2 weeks.",
  ],
  oiliness: [
    "Oily skin still needs hydration — over-stripping causes the skin to produce *more* oil. Use a gel cleanser, niacinamide 5%, lightweight gel moisturizer, and SPF. Avoid silicone-heavy products. Salicylic acid 1–2 nights a week keeps pores clear.",
  ],
  sensitive: [
    "For reactive skin: cut everything down to cleanser → moisturizer → SPF for 10 days. Then re-introduce ONE active at a time, 7 days apart. Centella and panthenol are your friends. Avoid fragrance and essential oils.",
  ],
  redness: [
    "Persistent redness usually points to barrier damage. Drop all actives for 2 weeks. Centella + panthenol serum, ceramide cream, mineral SPF. If redness with bumps persists, see a derm — could be rosacea.",
  ],
  dark_spots: [
    "Hyperpigmentation needs patience — 8–12 weeks minimum. Three-pronged: vitamin C in the AM, gentle exfoliation (mandelic or lactic acid) 2–3x/week, and SPF 50 every single day. Tranexamic acid is the secret weapon for melasma.",
  ],
  fine_lines: [
    "Fine lines respond best to: retinoids (the gold standard), peptides (good for layering), and consistent SPF. Bakuchiol is a gentler alternative if retinol irritates. Don't bother with collagen creams — collagen molecules are too large to penetrate.",
  ],
  routine_order: [
    "Order: thinnest to thickest. AM: cleanser → toner (optional) → water-based serum → eye cream → moisturizer → SPF. PM: cleanser → treatment serum (retinol/acid) → moisturizer → optional face oil. Wait 60 seconds between each layer.",
  ],
  ingredient_question: [
    "Tell me the exact ingredient name and I'll pull what we know — function, dose range, who it suits, who should skip. You can also paste an INCI list and I'll flag what stands out.",
  ],
  product_pick: [
    "I don't shill brands. Tell me your skin type, main concern, and budget — I'll tell you what to *look for* on the label (active, %, base) and you can pick the version that fits your wallet.",
  ],
  default: [
    "Tell me a bit more — what's your skin type and what are you trying to solve? Even one detail (e.g. 'combination, breakouts on the chin') is enough for me to give a real answer.",
  ],
};

function pickFrom<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function generateCoachReply(message: string): string {
  const topic = classify(message);
  const seed = hash(message);
  return pickFrom(REPLIES[topic], seed);
}
