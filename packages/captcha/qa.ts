export function challenge(){ const a=Math.floor(Math.random()*9)+1, b=Math.floor(Math.random()*9)+1; return {q:`${a}+${b}=?`, a:(a+b).toString()}; }
export function verify(ans:string, right:string){ return (ans||"").trim()===right; }
