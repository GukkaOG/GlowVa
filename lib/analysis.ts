// Mocked AI beauty analysis. Generates a deterministic but realistic-looking
// skin profile + skincare routine from a "photo signature" (hash of file
// contents) so the same photo always produces the same result. No real
// computer vision here — the assets ship without an ML dependency.

export type SkinType = "Oily" | "Dry" | "Combination" | "Normal" | "Sensitive";
export type Concern =
  | "Dehydration"
  | "Dullness"
  | "Uneven tone"
  | "Fine lines"
  | "Breakouts"
  | "Redness"
  | "Texture"
  | "Dark circles";

export type SkinProfile = {
  skinType: SkinType;
  mainConcern: Concern;
  secondaryConcerns: Concern[];
  hydration: number; // 0–100
  oiliness: "Low" | "Medium" | "High";
  sensitivity: "Low" | "Medium" | "High";
  brightness: number; // 0–100
  notes: string[];
};

export type RoutineStep = {
  step: string;
  product: string;
  hint?: string;
};

export type Routine = {
  morning: RoutineStep[];
  evening: RoutineStep[];
  weekly: RoutineStep[];
  hero: string;
  coachTip: string;
};

const SKIN_TYPES: SkinType[] = [
  "Oily",
  "Dry",
  "Combination",
  "Normal",
  "Sensitive",
];

const CONCERNS: Concern[] = [
  "Dehydration",
  "Dullness",
  "Uneven tone",
  "Fine lines",
  "Breakouts",
  "Redness",
  "Texture",
  "Dark circles",
];

function hashCode(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export function signatureFromBuffer(buffer: ArrayBuffer): string {
  // Cheap, deterministic signature — enough to differentiate uploads
  // without a crypto dependency on the edge.
  const view = new Uint8Array(buffer);
  let h1 = 0x811c9dc5;
  const len = Math.min(view.length, 4096);
  for (let i = 0; i < len; i++) {
    h1 ^= view[i];
    h1 = (h1 * 0x01000193) >>> 0;
  }
  return `s_${view.length.toString(36)}_${h1.toString(36)}`;
}

export function analyzeFromSignature(signature: string): {
  profile: SkinProfile;
  routine: Routine;
} {
  const seed = hashCode(signature);
  const skinType = pick(SKIN_TYPES, seed);
  const mainConcern = pick(CONCERNS, seed >> 3);
  let secondary = CONCERNS.filter((c) => c !== mainConcern);
  // Two stable secondary concerns
  const secondaryConcerns = [
    pick(secondary, seed >> 5),
    pick(
      secondary.filter((c) => c !== pick(secondary, seed >> 5)),
      seed >> 7
    ),
  ];

  const hydration = 38 + (seed % 50); // 38–87
  const brightness = 45 + ((seed >> 4) % 50);
  const oilLevel: SkinProfile["oiliness"] =
    skinType === "Oily"
      ? "High"
      : skinType === "Dry"
        ? "Low"
        : "Medium";
  const sensitivity: SkinProfile["sensitivity"] =
    skinType === "Sensitive" ? "High" : seed % 2 === 0 ? "Low" : "Medium";

  const notes = buildNotes(
    skinType,
    mainConcern,
    hydration,
    brightness,
    sensitivity
  );

  const profile: SkinProfile = {
    skinType,
    mainConcern,
    secondaryConcerns,
    hydration,
    oiliness: oilLevel,
    sensitivity,
    brightness,
    notes,
  };

  const routine = buildRoutine(profile);

  return { profile, routine };
}

function buildNotes(
  skin: SkinType,
  concern: Concern,
  hydration: number,
  brightness: number,
  sensitivity: SkinProfile["sensitivity"]
): string[] {
  const notes: string[] = [];
  if (hydration < 55) {
    notes.push(
      "Your skin barrier is reading slightly under-hydrated — layer hydrating actives before any retinoids."
    );
  } else {
    notes.push(
      "Hydration levels look healthy. Maintain with humectants like hyaluronic acid in the morning."
    );
  }
  if (brightness < 60) {
    notes.push(
      "Tone could use a glow boost — a vitamin C serum 3–4 mornings a week is a smart first step."
    );
  }
  if (sensitivity === "High") {
    notes.push(
      "Skin is reading reactive — introduce one new active at a time, with 7 days between additions."
    );
  }
  if (concern === "Breakouts") {
    notes.push(
      "Targeted salicylic acid in the evening, on affected zones only — not the whole face."
    );
  } else if (concern === "Fine lines") {
    notes.push(
      "Encapsulated retinol 0.3% three nights a week, sandwiched between moisturizer."
    );
  }
  if (skin === "Combination") {
    notes.push(
      "Combination skin loves zone-specific products — heavier cream on cheeks, lighter gel on T-zone."
    );
  }
  return notes.slice(0, 4);
}

function buildRoutine(profile: SkinProfile): Routine {
  const isDry = profile.skinType === "Dry";
  const isOily = profile.skinType === "Oily";
  const isSensitive = profile.sensitivity === "High";

  const cleanser = isDry
    ? "Creamy milk cleanser, pH 5.5"
    : isOily
      ? "Gentle gel cleanser, salicylic acid 0.5%"
      : "Balancing foam cleanser, amino-acid base";

  const moisturizer = isDry
    ? "Rich ceramide cream"
    : isOily
      ? "Lightweight gel moisturizer with niacinamide"
      : "Hydrating fluid with ceramide trio";

  const treatment =
    profile.mainConcern === "Breakouts"
      ? "Salicylic acid 1% — affected zones only"
      : profile.mainConcern === "Fine lines"
        ? "Encapsulated retinol 0.3%"
        : profile.mainConcern === "Dullness"
          ? "Vitamin C serum 10%"
          : profile.mainConcern === "Redness"
            ? "Centella + panthenol serum"
            : "Niacinamide 5% serum";

  const morningSerum = isSensitive
    ? "Centella calming essence"
    : profile.mainConcern === "Dullness"
      ? "Vitamin C 10% serum"
      : "Niacinamide 5% serum";

  return {
    hero: treatment,
    morning: [
      {
        step: "01",
        product: cleanser,
        hint: "Lukewarm water · 60 seconds",
      },
      {
        step: "02",
        product: morningSerum,
        hint: "2–3 drops, press into skin",
      },
      {
        step: "03",
        product: moisturizer,
        hint: "Hazelnut-sized amount",
      },
      {
        step: "04",
        product: "SPF 50, non-comedogenic",
        hint: "Every morning, even indoors",
      },
    ],
    evening: [
      {
        step: "01",
        product: "Oil-based cleanser (if wearing SPF/makeup)",
        hint: "Massage 60s · dry skin",
      },
      {
        step: "02",
        product: cleanser,
        hint: "Lukewarm water · 60 seconds",
      },
      {
        step: "03",
        product: treatment,
        hint: profile.mainConcern === "Fine lines" ? "3 nights / week" : "Daily",
      },
      {
        step: "04",
        product: moisturizer,
        hint: "Seals in the actives",
      },
    ],
    weekly: [
      {
        step: "Sun",
        product: isSensitive
          ? "Enzymatic mask, 10 min"
          : "Lactic acid exfoliating mask, 10 min",
        hint: "Once a week, on clean dry skin",
      },
      {
        step: "Wed",
        product: "Hydrating sheet mask",
        hint: "After cleansing, before bed",
      },
    ],
    coachTip:
      profile.hydration < 55
        ? "Your barrier needs water before anything else. Add a hyaluronic acid mist between cleanser and serum for 10 days and reassess."
        : "You're in a strong baseline. Don't add more than one new active per week — let your skin tell you what's working.",
  };
}
