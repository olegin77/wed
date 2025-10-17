export function reconcile(a: any[], b: any[]) {
  const A = new Map(a.map((x: any) => [x.id, x]));
  return b.filter((x) => !A.has(x.id));
}
