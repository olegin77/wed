export interface PreferenceQuestion {
  id: string;
  question: string;
  type: "single" | "multi" | "budget";
  options?: string[];
}

export interface PreferenceAnswers {
  [questionId: string]: string | string[] | number;
}

export const preferenceSurvey: PreferenceQuestion[] = [
  {
    id: "style",
    question: "Какой стиль свадьбы вам ближе?",
    type: "single",
    options: ["classic", "modern", "national", "minimal"],
  },
  {
    id: "guest_count",
    question: "Сколько гостей планируете пригласить?",
    type: "single",
    options: ["<50", "50-100", "100-200", ">200"],
  },
  {
    id: "must_have",
    question: "Что для вас обязательно?",
    type: "multi",
    options: ["live-music", "photo-video", "catering", "decor"],
  },
  {
    id: "budget",
    question: "Планируемый бюджет (UZS)",
    type: "budget",
  },
];

export function scoreVendorsByPreferences(
  answers: PreferenceAnswers,
  vendorTags: string[],
): number {
  let score = 0;
  const normalizedVendorTags = vendorTags.map(normalizeTag);
  const mustHave = new Set(
    ((answers.must_have as string[]) ?? []).map((tag) => normalizeTag(tag)),
  );
  normalizedVendorTags.forEach((tag) => {
    if (mustHave.has(tag)) score += 25;
  });
  const guestCount = answers.guest_count as string | undefined;
  if (guestCount) {
    const capacityTag = normalizeTag(`capacity-${guestCount}`);
    if (normalizedVendorTags.includes(capacityTag)) {
      score += 20;
    }
  }
  return Math.min(score, 100);
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
