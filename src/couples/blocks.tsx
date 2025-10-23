import React from "react";
export function Hero({title,subtitle}:{title:string;subtitle:string}){ return <header className="text-center py-12"><h1 className="text-4xl font-bold">{title}</h1><p className="opacity-80">{subtitle}</p></header>; }
/* i18n-ready */
export function Text({html}:{html:string}){ return <div className="prose max-w-2xl mx-auto" dangerouslySetInnerHTML={{__html:html}}/>; }
export function Gallery({images}:{images:{src:string;alt:string}[]}){ return <div className="gap-2 columns-2 sm:columns-3">{images.map((i,k)=><img key={k} src={i.src} alt={i.alt} className="rounded-2xl mb-2"/>)}</div>; }
