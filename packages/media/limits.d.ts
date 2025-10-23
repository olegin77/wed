/**
 * Константы для контроля загрузок медиа в DigitalOcean Spaces.
 * Значения указаны в мегабайтах.
 */
export declare const mediaLimits: {
    perVendorMb: number;
    perCoupleMb: number;
    singleUploadMb: number;
};
export type MediaLimitKey = keyof typeof mediaLimits;
export declare const getLimitInBytes: (key: MediaLimitKey) => number;
