import { retry } from "../../../packages/retry/index.js";
let tries=0; async function flaky(){ tries++; if(tries<2) throw new Error("temp"); return "ok"; }
retry(flaky,3,50).then(x=>console.log("result",x));
