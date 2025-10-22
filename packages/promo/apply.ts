export function applyPromo(amount:number, type:"PERCENT"|"FIXED", value:number){ if(type==="PERCENT") return Math.max(0, amount - Math.floor(amount*value/100)); return Math.max(0, amount - value); }
