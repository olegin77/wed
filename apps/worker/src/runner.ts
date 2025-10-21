import { enqueue } from "../../packages/queue/index";
export async function run(){ console.log("Worker stub running"); await enqueue("noop",{}); }
