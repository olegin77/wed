function vec(categories:string[], vcat:string){ return categories.includes(vcat)?1:0; }
export function similarity(userCats:string[], vendorCat:string){ const a=vec(userCats,vendorCat); const b=1; const dot=a*b; const na=Math.sqrt(a*a), nb=1; return na? dot/(na*nb):0; }
