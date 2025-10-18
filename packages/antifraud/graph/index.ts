import { link, neighbors } from "../../graph";

export { link };

export function suspiciousCluster(id: string): boolean {
  const direct = neighbors(id);
  if (direct.length > 10) {
    return true;
  }

  let sharedConnections = 0;
  for (const neighbor of direct) {
    sharedConnections += neighbors(neighbor).length;
    if (sharedConnections > 30) {
      return true;
    }
  }

  return false;
}
