import crypto from "crypto";
export type PutResult={ok:true,key:string,url:string};
export async function putObject(buf:Buffer, key:string):Promise<PutResult>{
  const fakeUrl=\`https://assets.weddingtech.uz/\${encodeURIComponent(key)}?v=\${crypto.randomBytes(4).toString("hex")}\`;
  return {ok:true,key,url:fakeUrl};
}
