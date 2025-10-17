import { score } from "@wt/mlrank";
import { extract } from "../../../../infra/feast/extract-features";

export function recomputeFor(vendors: any[]) {
  return vendors.map((v) => ({ id: v.id, rank: score(extract(v)) }));
}
