export function calcTotal({base,discount}){ const d=Math.min(Math.max(discount||0,0),100); return Math.max(0, Math.round(base*(100-d)/100)); }
