import { send } from "../../../packages/mail/index.js";
export async function invite(email, vendorTitle){ await send(email, "Приглашение менеджера", `<p>Вас добавили менеджером в ${vendorTitle}</p>`); return {ok:true}; }
