export function logj(level:"info"|"warn"|"error", msg:string, extra?:Record<string,any>){
  console.log(JSON.stringify({ts:new Date().toISOString(),level,msg,...(extra||{})}));
}
