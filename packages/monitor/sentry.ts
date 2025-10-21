export function captureException(e:any, ctx?:any){ console.error("SENTRY_STUB", e && e.message ? e.message : e, ctx||{}); }
