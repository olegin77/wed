import { audit } from "../../../packages/audit/log";
export function logVendor(action:string,payload:any){ audit("vendor."+action,payload); }
