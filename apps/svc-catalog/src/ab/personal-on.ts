import { enabled } from "../../../packages/ab/rollout";
export function personalEnabled(userId:string){ return enabled(userId,50); }
