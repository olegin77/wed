export function moneyUZS(n:number){ return new Intl.NumberFormat("ru-UZ",{style:"currency",currency:"UZS",maximumFractionDigits:0}).format(n); }
