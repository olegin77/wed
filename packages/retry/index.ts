export async function retry<T>(fn:()=>Promise<T>, times=3, baseMs=200){
  let last:any; for(let i=0;i<times;i++){ try{ return await fn(); }catch(e){ last=e; await new Promise(r=>setTimeout(r, baseMs*Math.pow(2,i))); } }
  throw last;
}
