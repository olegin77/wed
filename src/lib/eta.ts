export function etaMetersToMinutes(m:number, speedKmh=30){ const mins=(m/1000)/speedKmh*60; return Math.round(mins); }
