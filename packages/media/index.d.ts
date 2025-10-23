/// <reference types="node" />
/// <reference types="node" />
export type MinifyFormat = "jpeg" | "webp" | "avif" | "png";
export type MinifyOptions = {
    width?: number;
    height?: number;
    quality?: number;
    format?: MinifyFormat;
    progressive?: boolean;
    withoutEnlargement?: boolean;
    background?: string | {
        r: number;
        g: number;
        b: number;
        alpha?: number;
    };
};
export type MinifyResult = {
    data: Buffer;
    info: {
        format: string;
        size: number;
        width?: number;
        height?: number;
    };
};
export type MinifyVariantResult = {
    format: MinifyFormat;
    result: MinifyResult;
};
export declare function minifyImage(source: Buffer, options?: MinifyOptions): Promise<MinifyResult>;
export declare function minifyVariants(source: Buffer, variants: MinifyOptions[]): Promise<MinifyVariantResult[]>;
export declare function extractMetadata(source: Buffer): Promise<{
    width: any;
    height: any;
    format: any;
    orientation: any;
    hasAlpha: any;
    size: number;
} | null>;
export declare const minify: typeof minifyImage;
