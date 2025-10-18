import { presignPut as presignPutImpl } from "./presign.js";

export interface PresignPutParams {
  /**
   * Object key (path within the bucket) that should be signed.
   */
  key: string;

  /**
   * MIME type of the payload that will be uploaded via the signed URL.
   */
  contentType: string;

  /**
   * Optional SHA-256 hash of the payload to include in the signature.
   */
  payloadHash?: string;
}

export interface PresignPutResult {
  /**
   * Fully qualified presigned URL for the PUT request.
   */
  url: string;

  /**
   * Headers that must be supplied alongside the PUT request.
   */
  headers: Record<string, string>;
}

/**
 * Generates a presigned PUT URL compatible with DigitalOcean Spaces (S3).
 *
 * The helper performs input validation and throws when the object key,
 * content type, or Spaces credentials are missing or malformed.
 */
export const presignPut = presignPutImpl as (
  params: PresignPutParams,
) => PresignPutResult;
