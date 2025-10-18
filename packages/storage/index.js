// @ts-check
/**
 * @fileoverview Documented abstraction over S3-compatible object storage.
 *
 * The module exposes a thin wrapper above the AWS SDK v3 client that normalises
 * object keys, provides consistent error codes, and returns Node.js readable
 * streams to consumers. It is intentionally dependency-light and keeps the
 * public surface minimal so it can be consumed from both services and tests.
 */

import { Readable } from "node:stream";
import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

/** @typedef {import("@aws-sdk/client-s3").GetObjectCommandOutput} GetObjectCommandOutput */
/** @typedef {import("@aws-sdk/client-s3").ListObjectsV2CommandOutput} ListObjectsV2CommandOutput */

/**
 * Canonical error messages keyed by {@link StorageError.code} to keep thrown
 * errors user-friendly and machine-identifiable.
 * @type {Record<string, string>}
 */
const STORAGE_ERROR_MESSAGES = {
  "storage.invalid_config": "The storage configuration is incomplete.",
  "storage.invalid_key": "Object keys must be non-empty strings.",
  "storage.put_failed": "Uploading the object to storage failed.",
  "storage.get_failed": "Fetching the object from storage failed.",
  "storage.delete_failed": "Deleting the object from storage failed.",
  "storage.list_failed": "Listing objects in storage failed.",
  "storage.copy_failed": "Copying the object inside storage failed.",
  "storage.not_found": "The requested object does not exist in storage.",
  "storage.ensure_bucket_failed": "Ensuring the storage bucket exists failed.",
  "storage.public_url_not_configured": "The storage client is not configured with a public URL base.",
  "storage.unsupported_body": "The received storage payload could not be converted into a readable stream.",
};

/**
 * Custom error that annotates failures with a stable `code` property so callers
 * can branch on error categories without parsing the human-readable message.
 */
export class StorageError extends Error {
  /**
   * @param {keyof typeof STORAGE_ERROR_MESSAGES} code
   * @param {Error|undefined} [cause]
   */
  constructor(code, cause) {
    super(STORAGE_ERROR_MESSAGES[code] ?? "Storage operation failed.");
    this.name = "StorageError";
    /** @type {keyof typeof STORAGE_ERROR_MESSAGES} */
    this.code = code;
    if (cause) {
      /** @type {unknown} */
      this.cause = cause;
    }
    Error.captureStackTrace?.(this, StorageError);
  }
}

/**
 * @typedef {object} StorageCredentials
 * @property {string} accessKeyId - Programmatic access key identifier.
 * @property {string} secretAccessKey - Secret part of the access key pair.
 */

/**
 * @typedef {object} S3StorageConfig
 * @property {string} bucket - Target bucket name that will be used for all operations.
 * @property {string} region - Region where the bucket (or S3-compatible endpoint) resides.
 * @property {StorageCredentials} credentials - Credentials authorised to interact with the bucket.
 * @property {string} [endpoint] - Optional custom endpoint for S3-compatible vendors (e.g. MinIO, Spaces).
 * @property {boolean} [forcePathStyle=false] - Toggle for path-style requests, required by some vendors.
 * @property {string} [publicUrlBase] - Optional public base URL to construct shareable object links.
 */

/**
 * @typedef {object} PutObjectParams
 * @property {string} key - Object key (path) relative to the configured bucket.
 * @property {import("@aws-sdk/client-s3").PutObjectCommandInput["Body"]} body - Payload uploaded to storage.
 * @property {string} [contentType] - Optional MIME type associated with the object.
 * @property {string} [cacheControl] - Optional Cache-Control header value persisted alongside the object.
 * @property {Record<string, string | number | boolean | null | undefined>} [metadata] - User metadata for the object.
 * @property {"private"|"public-read"} [acl] - Canned ACL for vendors that support it.
 */

/**
 * @typedef {object} PutObjectResult
 * @property {string} key - Normalised object key of the uploaded payload.
 * @property {string | undefined} etag - Entity tag returned by the storage provider.
 */

/**
 * @typedef {object} GetObjectParams
 * @property {string} key - Object key to download from storage.
 */

/**
 * @typedef {object} GetObjectResult
 * @property {string} key - Object key corresponding to the retrieved payload.
 * @property {Readable} body - Node.js readable stream with the object contents.
 * @property {number | undefined} contentLength - Size in bytes reported by the provider.
 * @property {string | undefined} contentType - MIME type provided by the storage engine.
 * @property {string | undefined} etag - Entity tag assigned by the provider.
 * @property {Date | undefined} lastModified - Last modification timestamp of the object.
 * @property {Record<string, string>} metadata - User metadata stored alongside the object.
 */

/**
 * @typedef {object} DeleteObjectParams
 * @property {string} key - Object key to remove from the bucket.
 */

/**
 * @typedef {object} CopyObjectParams
 * @property {string} sourceKey - Existing object key that will be copied.
 * @property {string} destinationKey - Destination key for the new object.
 * @property {Record<string, string | number | boolean | null | undefined>} [metadata] - Optional metadata to overwrite.
 */

/**
 * @typedef {object} CopyObjectResult
 * @property {string} key - Destination key of the copied object.
 * @property {string | undefined} etag - Entity tag of the new object.
 * @property {Date | undefined} lastModified - Last modification timestamp assigned to the copied object.
 */

/**
 * @typedef {object} ListObjectsParams
 * @property {string} [prefix] - Optional key prefix to filter listed objects.
 * @property {string} [cursor] - Continuation token for paginated listings.
 * @property {number} [maxKeys] - Maximum objects returned by the underlying provider.
 */

/**
 * @typedef {object} ListedObject
 * @property {string} key - Key of the listed object.
 * @property {number | undefined} size - Size reported by the provider.
 * @property {string | undefined} etag - Entity tag of the object.
 * @property {Date | undefined} lastModified - Last modification timestamp reported by the provider.
 */

/**
 * @typedef {object} ListObjectsResult
 * @property {ListedObject[]} items - Collection of objects returned for the request.
 * @property {string | undefined} nextCursor - Continuation token for retrieving the next page.
 */

/**
 * @typedef {object} EnsureBucketOptions
 * @property {boolean} [createIfMissing=true] - Whether the helper should attempt to create the bucket when missing.
 */

/**
 * @typedef {object} S3Storage
 * @property {S3Client} client - Underlying AWS SDK client instance.
 * @property {string} bucket - Bucket name used for operations.
 * @property {(params?: EnsureBucketOptions) => Promise<void>} ensureBucket - Ensures the bucket exists and optionally creates it.
 * @property {(params: PutObjectParams) => Promise<PutObjectResult>} putObject - Uploads a payload to storage.
 * @property {(params: GetObjectParams) => Promise<GetObjectResult>} getObject - Downloads a payload from storage.
 * @property {(params: DeleteObjectParams) => Promise<void>} deleteObject - Removes an object from storage.
 * @property {(params: CopyObjectParams) => Promise<CopyObjectResult>} copyObject - Copies an object to a new key.
 * @property {(params?: ListObjectsParams) => Promise<ListObjectsResult>} listObjects - Lists objects within the bucket.
 * @property {(key: string) => string} getPublicUrl - Resolves a shareable URL when `publicUrlBase` is configured.
 */

/**
 * Validates that the provided configuration contains all the required fields.
 * @param {S3StorageConfig} config
 */
const validateConfig = (config) => {
  if (!config || typeof config !== "object") {
    throw new StorageError("storage.invalid_config");
  }

  const { bucket, region, credentials } = config;
  if (!isNonEmptyString(bucket) || !isNonEmptyString(region)) {
    throw new StorageError("storage.invalid_config");
  }

  if (!credentials || typeof credentials !== "object") {
    throw new StorageError("storage.invalid_config");
  }

  if (!isNonEmptyString(credentials.accessKeyId) || !isNonEmptyString(credentials.secretAccessKey)) {
    throw new StorageError("storage.invalid_config");
  }
};

/**
 * Checks whether the supplied value is a non-empty string after trimming.
 * @param {unknown} value
 * @returns {value is string}
 */
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

/**
 * Normalises object keys by removing leading slashes and trimming whitespace.
 * @param {string} key
 * @returns {string}
 */
const normalizeKey = (key) => {
  if (typeof key !== "string") {
    throw new StorageError("storage.invalid_key");
  }

  const trimmed = key.trim();
  if (trimmed.length === 0) {
    throw new StorageError("storage.invalid_key");
  }

  return trimmed.replace(/^\/+/, "");
};

/**
 * Normalises a prefix for list operations, returning undefined for empty values.
 * @param {string | undefined} prefix
 * @returns {string | undefined}
 */
const normalizePrefix = (prefix) => {
  if (typeof prefix === "undefined") {
    return undefined;
  }

  const trimmed = prefix.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  return trimmed.replace(/^\/+/, "");
};

/**
 * Serialises user metadata into an S3-compatible record of lowercase strings.
 * @param {Record<string, string | number | boolean | null | undefined> | undefined} metadata
 * @returns {Record<string, string> | undefined}
 */
const serializeMetadata = (metadata) => {
  if (!metadata) {
    return undefined;
  }

  /** @type {Record<string, string>} */
  const serialised = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value === undefined || value === null) {
      continue;
    }

    serialised[key.toLowerCase()] = String(value);
  }

  return Object.keys(serialised).length > 0 ? serialised : undefined;
};

/**
 * Converts the AWS SDK body output into a Node.js readable stream.
 * @param {GetObjectCommandOutput["Body"]} body
 * @returns {Readable}
 */
const toReadableStream = (body) => {
  if (!body) {
    throw new StorageError("storage.unsupported_body");
  }

  if (body instanceof Readable) {
    return body;
  }

  if (typeof body === "string" || body instanceof Uint8Array) {
    return Readable.from([body]);
  }

  if (typeof body.getReader === "function") {
    return Readable.fromWeb(body);
  }

  if (typeof body.transformToWebStream === "function") {
    return Readable.fromWeb(body.transformToWebStream());
  }

  throw new StorageError("storage.unsupported_body");
};

/**
 * Determines whether the thrown error corresponds to a missing object.
 * @param {unknown} error
 * @returns {boolean}
 */
const isNotFoundError = (error) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const metadata = /** @type {{ $metadata?: { httpStatusCode?: number } }} */ (error).$metadata;
  if (metadata?.httpStatusCode === 404) {
    return true;
  }

  const name = /** @type {{ name?: string }} */ (error).name;
  const code = /** @type {{ Code?: string }} */ (error).Code;
  return name === "NoSuchKey" || name === "NotFound" || code === "NoSuchKey";
};

/**
 * Creates an AWS SDK client tailored for the provided configuration.
 * @param {S3StorageConfig} config
 * @returns {S3Client}
 */
const createClient = (config) =>
  new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle ?? false,
    credentials: {
      accessKeyId: config.credentials.accessKeyId,
      secretAccessKey: config.credentials.secretAccessKey,
    },
  });

/**
 * Wraps the root configuration and exposes a documented storage abstraction.
 * @param {S3StorageConfig} config
 * @param {{ client?: S3Client }} [options]
 * @returns {S3Storage}
 */
export const createS3Storage = (config, options = {}) => {
  validateConfig(config);

  const bucket = config.bucket.trim();
  const client = options.client ?? createClient(config);
  const publicUrlBase = config.publicUrlBase ? config.publicUrlBase.replace(/\/+$/, "") : undefined;

  /**
   * Ensures the bucket exists by performing a HEAD request and, optionally,
   * creating the bucket when it is missing.
   * @param {EnsureBucketOptions} [params]
   */
  const ensureBucket = async (params = {}) => {
    const { createIfMissing = true } = params;

    try {
      await client.send(new HeadBucketCommand({ Bucket: bucket }));
      return;
    } catch (error) {
      if (!createIfMissing) {
        throw new StorageError("storage.ensure_bucket_failed", /** @type {Error} */ (error));
      }

      try {
        await client.send(new CreateBucketCommand({ Bucket: bucket }));
      } catch (creationError) {
        throw new StorageError("storage.ensure_bucket_failed", /** @type {Error} */ (creationError));
      }
    }
  };

  /**
   * Uploads a payload to the configured bucket while enforcing consistent
   * metadata serialization and key normalization.
   * @param {PutObjectParams} params
   * @returns {Promise<PutObjectResult>}
   */
  const putObject = async (params) => {
    const key = normalizeKey(params.key);

    try {
      const output = await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: params.body,
          ContentType: params.contentType,
          CacheControl: params.cacheControl,
          Metadata: serializeMetadata(params.metadata),
          ACL: params.acl,
        }),
      );

      return { key, etag: sanitizeEtag(output.ETag) };
    } catch (error) {
      throw new StorageError("storage.put_failed", /** @type {Error} */ (error));
    }
  };

  /**
   * Retrieves an object from storage and exposes it as a Node.js readable stream.
   * @param {GetObjectParams} params
   * @returns {Promise<GetObjectResult>}
   */
  const getObject = async (params) => {
    const key = normalizeKey(params.key);

    try {
      const output = await client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );

      return {
        key,
        body: toReadableStream(output.Body),
        contentLength: output.ContentLength ?? undefined,
        contentType: output.ContentType ?? undefined,
        etag: sanitizeEtag(output.ETag),
        lastModified: output.LastModified ?? undefined,
        metadata: output.Metadata ?? {},
      };
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new StorageError("storage.not_found", /** @type {Error} */ (error));
      }

      throw new StorageError("storage.get_failed", /** @type {Error} */ (error));
    }
  };

  /**
   * Deletes the specified object from the configured bucket.
   * @param {DeleteObjectParams} params
   * @returns {Promise<void>}
   */
  const deleteObject = async (params) => {
    const key = normalizeKey(params.key);

    try {
      await client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
    } catch (error) {
      throw new StorageError("storage.delete_failed", /** @type {Error} */ (error));
    }
  };

  /**
   * Copies an existing object to a new key while optionally replacing metadata.
   * @param {CopyObjectParams} params
   * @returns {Promise<CopyObjectResult>}
   */
  const copyObject = async (params) => {
    const sourceKey = normalizeKey(params.sourceKey);
    const destinationKey = normalizeKey(params.destinationKey);
    const metadata = serializeMetadata(params.metadata);

    try {
      const output = await client.send(
        new CopyObjectCommand({
          Bucket: bucket,
          Key: destinationKey,
          CopySource: encodeCopySource(bucket, sourceKey),
          Metadata: metadata,
          MetadataDirective: metadata ? "REPLACE" : undefined,
        }),
      );

      const copyResult = output.CopyObjectResult ?? {};
      return {
        key: destinationKey,
        etag: sanitizeEtag(copyResult.ETag),
        lastModified: copyResult.LastModified ?? undefined,
      };
    } catch (error) {
      throw new StorageError("storage.copy_failed", /** @type {Error} */ (error));
    }
  };

  /**
   * Lists objects within the bucket with optional prefix and pagination support.
   * @param {ListObjectsParams} [params]
   * @returns {Promise<ListObjectsResult>}
   */
  const listObjects = async (params = {}) => {
    try {
      const output = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: normalizePrefix(params.prefix),
          ContinuationToken: params.cursor,
          MaxKeys: params.maxKeys,
        }),
      );

      return {
        items: mapListedObjects(output),
        nextCursor:
          output.IsTruncated && output.NextContinuationToken
            ? output.NextContinuationToken
            : undefined,
      };
    } catch (error) {
      throw new StorageError("storage.list_failed", /** @type {Error} */ (error));
    }
  };

  /**
   * Resolves a public URL for the provided key, raising an error when the
   * client was not configured with `publicUrlBase`.
   * @param {string} key
   * @returns {string}
   */
  const getPublicUrl = (key) => {
    if (!publicUrlBase) {
      throw new StorageError("storage.public_url_not_configured");
    }

    const normalisedKey = normalizeKey(key);
    return `${publicUrlBase}/${normalisedKey.split("/").map(encodeURIComponent).join("/")}`;
  };

  return {
    client,
    bucket,
    ensureBucket,
    putObject,
    getObject,
    deleteObject,
    copyObject,
    listObjects,
    getPublicUrl,
  };
};

/**
 * Ensures entity tags returned by the provider are consistent and stripped of
 * surrounding quotes.
 * @param {string | undefined} etag
 * @returns {string | undefined}
 */
const sanitizeEtag = (etag) => {
  if (!etag) {
    return undefined;
  }

  return etag.replace(/"/g, "");
};

/**
 * Maps the AWS SDK response into a simplified list of objects.
 * @param {ListObjectsV2CommandOutput} output
 * @returns {ListedObject[]}
 */
const mapListedObjects = (output) => {
  const contents = output.Contents ?? [];

  return contents
    .filter((item) => Boolean(item.Key))
    .map((item) => ({
      key: /** @type {string} */ (item.Key),
      size: item.Size ?? undefined,
      etag: sanitizeEtag(item.ETag ?? undefined),
      lastModified: item.LastModified ?? undefined,
    }));
};

/**
 * Encodes the bucket/key pair for the CopyObject API.
 * @param {string} bucket
 * @param {string} key
 * @returns {string}
 */
const encodeCopySource = (bucket, key) => encodeURIComponent(`${bucket}/${key}`);
