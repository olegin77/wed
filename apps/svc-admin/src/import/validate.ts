export function validateRow(obj:any){ const errs:string[]=[]; if(!obj.title) errs.push("title"); if(!obj.city) errs.push("city"); if(!obj.category) errs.push("category"); return errs; }
