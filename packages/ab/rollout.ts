import { bucket } from "./index";
export function enabled(userId:string, percent=10){ return bucket(userId,100) < percent; }
