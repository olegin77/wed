export function applyBonus(total, bonus){ const use=Math.min(total, Math.max(0, bonus||0)); return {payable: total-use, used: use}; }
