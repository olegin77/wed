import { Readable } from "node:stream";

/**
 * Information describing a chunk that has been uploaded to the target storage.
 */
export interface UploadedPart {
  /** Sequential chunk number starting at 1. */
  partNumber: number;
  /** Opaque ETag or checksum returned by the storage backend. */
  etag: string;
  /** Raw byte length of the chunk. */
  size: number;
}

/** Callback invoked after each chunk upload. */
export type ProgressCallback = (info: {
  partNumber: number;
  size: number;
  totalUploaded: number;
}) => void;

/** Contract that has to be implemented by any multipart storage backend. */
export interface MultipartUploadTarget {
  initiate(objectKey: string): Promise<string>;
  uploadPart(params: {
    objectKey: string;
    uploadId: string;
    partNumber: number;
    payload: Buffer;
  }): Promise<{ etag: string }>;
  complete(params: {
    objectKey: string;
    uploadId: string;
    parts: UploadedPart[];
  }): Promise<void>;
  abort?(params: { objectKey: string; uploadId: string }): Promise<void>;
}

export interface ChunkUploadParams {
  objectKey: string;
  chunkSize: number;
  source: Readable;
  target: MultipartUploadTarget;
  onProgress?: ProgressCallback;
}

/**
 * Splits a readable stream into fixed-size chunks and uploads them sequentially
 * using the provided multipart target. Designed to work with S3-compatible
 * storage (MinIO, AWS S3) but keeps the contract generic for tests.
 */
export const chunkUpload = async ({
  objectKey,
  chunkSize,
  source,
  target,
  onProgress,
}: ChunkUploadParams): Promise<{ uploadId: string; parts: UploadedPart[] }> => {
  if (!objectKey) {
    throw new Error("objectKey is required for chunkUpload");
  }
  if (!Number.isFinite(chunkSize) || chunkSize <= 0) {
    throw new Error("chunkSize must be a positive number of bytes");
  }

  const uploadId = await target.initiate(objectKey);
  const uploadedParts: UploadedPart[] = [];
  let buffered = Buffer.alloc(0);
  let partNumber = 1;
  let totalUploaded = 0;

  const flushBuffer = async () => {
    if (buffered.length === 0) {
      return;
    }
    const payload = buffered;
    buffered = Buffer.alloc(0);
    const { etag } = await target.uploadPart({ objectKey, uploadId, partNumber, payload });
    const info: UploadedPart = { partNumber, etag, size: payload.length };
    uploadedParts.push(info);
    totalUploaded += payload.length;
    onProgress?.({ partNumber, size: payload.length, totalUploaded });
    partNumber += 1;
  };

  try {
    for await (const chunk of source) {
      const piece = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Buffer);
      buffered = Buffer.concat([buffered, piece]);
      while (buffered.length >= chunkSize) {
        const next = buffered.subarray(0, chunkSize);
        buffered = buffered.subarray(chunkSize);
        const { etag } = await target.uploadPart({ objectKey, uploadId, partNumber, payload: Buffer.from(next) });
        const info: UploadedPart = { partNumber, etag, size: next.length };
        uploadedParts.push(info);
        totalUploaded += next.length;
        onProgress?.({ partNumber, size: next.length, totalUploaded });
        partNumber += 1;
      }
    }

    await flushBuffer();
    await target.complete({ objectKey, uploadId, parts: uploadedParts });
    return { uploadId, parts: uploadedParts };
  } catch (error) {
    if (target.abort) {
      await target.abort({ objectKey, uploadId });
    }
    throw error;
  }
};

/**
 * In-memory multipart target primarily for tests. Stores chunks in an array and
 * returns deterministic ETags derived from the payload length.
 */
export const createMemoryTarget = () => {
  const store = new Map<string, Buffer[]>();
  return {
    async initiate(objectKey: string): Promise<string> {
      store.set(objectKey, []);
      return `upload-${objectKey}`;
    },
    async uploadPart({ objectKey, payload }: { objectKey: string; uploadId: string; partNumber: number; payload: Buffer }) {
      const parts = store.get(objectKey);
      if (!parts) {
        throw new Error(`Upload for ${objectKey} was not initiated`);
      }
      parts.push(payload);
      return { etag: `etag-${payload.length}` };
    },
    async complete({ objectKey }: { objectKey: string; uploadId: string; parts: UploadedPart[] }) {
      if (!store.has(objectKey)) {
        throw new Error(`Upload for ${objectKey} missing during complete`);
      }
    },
    async abort({ objectKey }: { objectKey: string; uploadId: string }) {
      store.delete(objectKey);
    },
    /** Exposes the stored buffers for assertions in tests. */
    dump(objectKey: string): Buffer[] {
      return store.get(objectKey) ?? [];
    },
  } satisfies MultipartUploadTarget & { dump(objectKey: string): Buffer[] };
};
