import { enqueue } from "../../../packages/queue/index";
export function enqueueThumb(key:string){ return enqueue("thumb256",{key}); }
