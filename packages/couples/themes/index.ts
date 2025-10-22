export type Theme="classic"|"elegant"|"photo";
export const themes:Record<Theme,{palette:{bg:string;fg:string;accent:string}}>={
  classic:{palette:{bg:"#ffffff",fg:"#111827",accent:"#7c3aed"}},
  elegant:{palette:{bg:"#faf7f5",fg:"#3f3f46",accent:"#b45309"}},
  photo:{palette:{bg:"#0b0b10",fg:"#e5e7eb",accent:"#34d399"}}
};
