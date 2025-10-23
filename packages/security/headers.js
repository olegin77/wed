export const securityHeaders = [
    ["X-Frame-Options", "DENY"],
    ["X-Content-Type-Options", "nosniff"],
    ["Referrer-Policy", "strict-origin-when-cross-origin"],
    ["Cross-Origin-Resource-Policy", "same-origin"],
    ["Cross-Origin-Opener-Policy", "same-origin"],
    ["Permissions-Policy", "camera=(), microphone=(), geolocation=()"],
    ["X-DNS-Prefetch-Control", "off"],
    ["X-XSS-Protection", "1; mode=block"],
    ["Strict-Transport-Security", "max-age=31536000; includeSubDomains"],
    ["Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"],
];
