export type Intent={id:string;clientSecret?:string;amount:number;currency:string;status:"requires_payment"|"succeeded"|"refunded"};
export interface PaymentProvider{ createIntent(a:{amount:number;currency:string}):Promise<Intent>; capture(id:string):Promise<Intent>; refund(id:string):Promise<Intent>; }
