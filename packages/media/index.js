async function loadSharp() {
    try {
        const mod = await import("sharp");
        return mod.default ?? mod;
    }
    catch {
        return null;
    }
}
function applyFormat(pipeline, format, quality, progressive) {
    switch (format) {
        case "webp":
            pipeline.webp({ quality, smartSubsample: true, effort: 4 });
            break;
        case "avif":
            pipeline.avif({ quality, effort: 3 });
            break;
        case "png":
            pipeline.png({
                compressionLevel: 9,
                adaptiveFiltering: true,
                palette: true,
                quality,
            });
            break;
        case "jpeg":
        default:
            pipeline.jpeg({ quality, mozjpeg: true, progressive });
            break;
    }
}
export async function minifyImage(source, options = {}) {
    const sharp = await loadSharp();
    if (!sharp) {
        return {
            data: source,
            info: { format: "raw", size: source.length },
        };
    }
    const { width, height, quality = 80, format = "jpeg", progressive = true, withoutEnlargement = true, background, } = options;
    const pipeline = sharp(source, { failOn: "warning" }).rotate();
    if (width || height) {
        pipeline.resize(width, height, { fit: "inside", withoutEnlargement, background });
    }
    applyFormat(pipeline, format, quality, progressive);
    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
    return {
        data,
        info: {
            format: info.format,
            size: info.size,
            width: info.width,
            height: info.height,
        },
    };
}
export async function minifyVariants(source, variants) {
    const sharp = await loadSharp();
    if (!sharp) {
        return variants.map((variant) => ({
            format: variant.format ?? "jpeg",
            result: {
                data: source,
                info: { format: "raw", size: source.length },
            },
        }));
    }
    const results = [];
    for (const variant of variants) {
        const { format = "jpeg", quality = 80, width, height, progressive = true, withoutEnlargement = true, background, } = variant;
        const pipeline = sharp(source, { failOn: "warning" }).rotate();
        if (width || height) {
            pipeline.resize(width, height, { fit: "inside", withoutEnlargement, background });
        }
        applyFormat(pipeline, format, quality, progressive);
        const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
        results.push({
            format,
            result: {
                data,
                info: {
                    format: info.format,
                    size: info.size,
                    width: info.width,
                    height: info.height,
                },
            },
        });
    }
    return results;
}
export async function extractMetadata(source) {
    const sharp = await loadSharp();
    if (!sharp) {
        return null;
    }
    const meta = await sharp(source).metadata();
    return {
        width: meta.width ?? null,
        height: meta.height ?? null,
        format: meta.format ?? null,
        orientation: meta.orientation ?? null,
        hasAlpha: meta.hasAlpha ?? false,
        size: source.length,
    };
}
export const minify = minifyImage;
