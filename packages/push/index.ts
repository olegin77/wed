// Stub interface to abstract web push (external sender configured elsewhere)
export type Subscription={endpoint:string;keys:{p256dh:string;auth:string}};
export async function sendPush(sub:Subscription, payload:{title:string;body:string;url?:string}){
  // In production: use 'web-push' or a push gateway. Here we log only.
  console.log("PUSH_STUB", sub.endpoint.slice(0,32), payload.title);
  return {ok:true};
}
