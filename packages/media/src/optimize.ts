import fs from "node:fs";
import path from "node:path";
import { minifyImage } from "../index";

export async function resize(input: string, outDir: string, widths: number[] = [480, 960, 1440]) {
  fs.mkdirSync(outDir, { recursive: true });
  const data = fs.readFileSync(input);
  const ext = path.extname(input).toLowerCase();
  const base = path.basename(input, ext);

  for (const width of widths) {
    const { data: output } = await minifyImage(data, { width });
    const target = path.join(outDir, `${base}-${width}.jpg`);
    fs.writeFileSync(target, output);
  }

  return { ok: true } as const;
}
