export function toSkipTake(q:{page?:string|number;limit?:string|number}, dPage=1, dLimit=20){
  const p=Math.max(1, Number(q.page||dPage)); const l=Math.max(1, Math.min(100, Number(q.limit||dLimit)));
  return { skip:(p-1)*l, take:l };
}
