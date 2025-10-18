/**
 * Supported 3D tour providers.
 */
export type ThreeDTourProvider = "matterport" | "custom";

/**
 * Normalised 3D tour reference for venue pages.
 */
export interface ThreeDTour {
  provider: ThreeDTourProvider;
  url: string;
  title?: string;
  previewImageUrl?: string;
}

const PROVIDERS: ThreeDTourProvider[] = ["matterport", "custom"];

/**
 * Validates and normalises raw tour data coming from the CMS/imports.
 */
export function normalizeThreeDTour(raw: {
  provider?: string;
  url: string;
  title?: string;
  previewImageUrl?: string;
}): ThreeDTour {
  const provider = (raw.provider ?? "custom").toLowerCase();
  if (!PROVIDERS.includes(provider as ThreeDTourProvider)) {
    throw new Error(`Unsupported 3D tour provider: ${provider}`);
  }

  if (!raw.url) {
    throw new Error("3D tour URL is required");
  }

  return {
    provider: provider as ThreeDTourProvider,
    url: raw.url,
    title: raw.title,
    previewImageUrl: raw.previewImageUrl,
  };
}

/**
 * Type guard for the ThreeDTour contract.
 */
export function isThreeDTour(value: unknown): value is ThreeDTour {
  if (!value || typeof value !== "object") {
    return false;
  }

  const tour = value as Partial<ThreeDTour>;
  return (
    typeof tour.url === "string" &&
    typeof tour.provider === "string" &&
    PROVIDERS.includes(tour.provider as ThreeDTourProvider)
  );
}
