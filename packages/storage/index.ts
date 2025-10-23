import type { Readable } from "node:stream";
import type { S3Client } from "@aws-sdk/client-s3";

// StorageError will be defined below

/** Credentials used by the S3-compatible provider. */
export interface StorageCredentials {
  /** Programmatic access key identifier. */
  accessKeyId: string;
  /** Secret part of the access key pair. */
  secretAccessKey: string;
}

/** Configuration recognised by {@link createS3Storage}. */
export interface S3StorageConfig {
  /** Target bucket name where all operations will be executed. */
  bucket: string;
  /** Region identifier associated with the endpoint. */
  region: string;
  /** Provider credentials authorised to access the bucket. */
  credentials: StorageCredentials;
  /** Optional custom endpoint for S3-compatible vendors such as MinIO. */
  endpoint?: string;
  /** Enables path-style addressing, required by several compatible vendors. */
  forcePathStyle?: boolean;
  /** Public base URL used to generate shareable object links. */
  publicUrlBase?: string;
}

/** Input accepted by {@link S3Storage.putObject}. */
export interface PutObjectParams {
  /** Object key (path) relative to the configured bucket. */
  key: string;
  /** Binary payload that will be persisted in storage. */
  body: import("@aws-sdk/client-s3").PutObjectCommandInput["Body"];
  /** Optional MIME type metadata. */
  contentType?: string;
  /** Optional cache-control directive persisted alongside the object. */
  cacheControl?: string;
  /** Arbitrary user metadata stored with the object. */
  metadata?: Record<string, string | number | boolean | null | undefined>;
  /** Optional canned ACL toggled for compatible providers. */
  acl?: "private" | "public-read";
}

/** Result returned by {@link S3Storage.putObject}. */
export interface PutObjectResult {
  /** Normalised object key of the uploaded payload. */
  key: string;
  /** Entity tag (ETag) reported by the provider. */
  etag?: string;
}

/** Input accepted by {@link S3Storage.getObject}. */
export interface GetObjectParams {
  /** Object key to retrieve. */
  key: string;
}

/** Output returned by {@link S3Storage.getObject}. */
export interface GetObjectResult {
  /** Object key corresponding to the retrieved payload. */
  key: string;
  /** Node.js readable stream exposing the payload. */
  body: Readable;
  /** Object size reported by the provider. */
  contentLength?: number;
  /** MIME type metadata returned by the provider. */
  contentType?: string;
  /** Entity tag (ETag) reported by the provider. */
  etag?: string;
  /** Last modification timestamp reported by the provider. */
  lastModified?: Date;
  /** User metadata stored alongside the object. */
  metadata: Record<string, string>;
}

/** Input accepted by {@link S3Storage.deleteObject}. */
export interface DeleteObjectParams {
  /** Object key that should be removed. */
  key: string;
}

/** Input accepted by {@link S3Storage.copyObject}. */
export interface CopyObjectParams {
  /** Existing object key to clone. */
  sourceKey: string;
  /** Destination key for the cloned payload. */
  destinationKey: string;
  /** Optional metadata replacement for the copied object. */
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

/** Output returned by {@link S3Storage.copyObject}. */
export interface CopyObjectResult {
  /** Destination key of the copied object. */
  key: string;
  /** Entity tag (ETag) reported by the provider. */
  etag?: string;
  /** Timestamp assigned to the copied object. */
  lastModified?: Date;
}

/** Input accepted by {@link S3Storage.listObjects}. */
export interface ListObjectsParams {
  /** Optional prefix restricting the listing scope. */
  prefix?: string;
  /** Continuation token for paginated listings. */
  cursor?: string;
  /** Maximum amount of objects returned for the page. */
  maxKeys?: number;
}

/** Representation of a listed object. */
export interface ListedObject {
  /** Object key returned by the provider. */
  key: string;
  /** Object size returned by the provider. */
  size?: number;
  /** Entity tag (ETag) reported by the provider. */
  etag?: string;
  /** Last modification timestamp reported by the provider. */
  lastModified?: Date;
}

/** Output returned by {@link S3Storage.listObjects}. */
export interface ListObjectsResult {
  /** Collection of listed objects. */
  items: ListedObject[];
  /** Continuation token to request the next page. */
  nextCursor?: string;
}

/** Options accepted by {@link S3Storage.ensureBucket}. */
export interface EnsureBucketOptions {
  /** Attempt to create the bucket when the HEAD request fails. */
  createIfMissing?: boolean;
}

/** Public surface returned by {@link createS3Storage}. */
export interface S3Storage {
  /** Underlying AWS SDK client instance. */
  client: S3Client;
  /** Bucket name bound to the storage helper. */
  bucket: string;
  /** Ensures the bucket exists and optionally creates it. */
  ensureBucket(params?: EnsureBucketOptions): Promise<void>;
  /** Uploads a payload to storage. */
  putObject(params: PutObjectParams): Promise<PutObjectResult>;
  /** Downloads an object as a readable stream. */
  getObject(params: GetObjectParams): Promise<GetObjectResult>;
  /** Removes the specified object from storage. */
  deleteObject(params: DeleteObjectParams): Promise<void>;
  /** Copies an object to a new key. */
  copyObject(params: CopyObjectParams): Promise<CopyObjectResult>;
  /** Lists objects within the bucket with optional pagination. */
  listObjects(params?: ListObjectsParams): Promise<ListObjectsResult>;
  /** Resolves a public URL for the provided key. */
  getPublicUrl(key: string): string;
}

export { StorageError };

export const createS3Storage = createS3StorageImpl as (
  config: S3StorageConfig,
  options?: { client?: S3Client },
) => S3Storage;
