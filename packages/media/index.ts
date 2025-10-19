export type MinifyOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

export type MinifyResult = {
  data: Buffer;
  info: {
    format: string;
    size: number;
  };
};

async function loadSharp(): Promise<typeof import("sharp") | null> {
  try {
    const mod = await import("sharp");
    return mod.default ?? (mod as unknown as typeof import("sharp"));
  } catch {
    return null;
  }
}

export async function minifyImage(source: Buffer, options: MinifyOptions = {}): Promise<MinifyResult> {
  const sharp = await loadSharp();
  if (!sharp) {
    return {
      data: source,
      info: { format: "raw", size: source.length },
    };
  }

  const pipeline = sharp(source, { failOn: "warning" });
  if (options.width || options.height) {
    pipeline.resize(options.width, options.height, { fit: "inside", withoutEnlargement: true });
  }
  pipeline.jpeg({ quality: options.quality ?? 75 }).webp({ quality: options.quality ?? 75 });
  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  return {
    data,
    info: { format: info.format, size: info.size },
  };
}

export const minify = minifyImage;
