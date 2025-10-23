/**
 * Константы для контроля загрузок медиа в DigitalOcean Spaces.
 * Значения указаны в мегабайтах.
 */
export const mediaLimits = {
    perVendorMb: 1024,
    perCoupleMb: 512,
    singleUploadMb: 100,
};
export const getLimitInBytes = (key) => mediaLimits[key] * 1024 * 1024;
