export function coupleOg({slug,title}:{slug:string;title:string}){ return [
  ["meta",{property:"og:title",content:title}],
  ["meta",{property:"og:url",content:`https://weddingtech.uz/couple/${slug}`}],
  ["meta",{property:"og:type",content:"website"}]
]; }
