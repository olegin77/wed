export type ImageVariant = { name: 'thumb' | 'preview' | 'full'; w: number };

export const variants: ImageVariant[] = [
  { name: 'thumb', w: 240 },
  { name: 'preview', w: 960 },
  { name: 'full', w: 2048 },
];

export type VariantName = "thumb" | "preview" | "full";

export interface MediaVariant {
  name: VariantName;
  width: number;
  height?: number;
  quality: number;
  purpose: string;
}

export const variants: MediaVariant[] = [
  { name: "thumb", width: 240, quality: 70, purpose: "Карточки списка, плейсхолдеры" },
  { name: "preview", width: 960, quality: 75, purpose: "Галерея и лендинги" },
  { name: "full", width: 2048, quality: 85, purpose: "Зум и скачивание" },
];

export function getVariant(name: VariantName): MediaVariant {
  const variant = variants.find((item) => item.name === name);
  if (!variant) {
    throw new Error(`Unknown media variant: ${name}`);
  }
  return variant;
}
