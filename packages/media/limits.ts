/**
 * Константы для контроля загрузок медиа в DigitalOcean Spaces.
 * Значения указаны в мегабайтах.
 */
export const mediaLimits = {
  perVendorMb: 1024,
  perCoupleMb: 512,
  singleUploadMb: 100,
};

export type MediaLimitKey = keyof typeof mediaLimits;

export const getLimitInBytes = (key: MediaLimitKey): number =>
  mediaLimits[key] * 1024 * 1024;
