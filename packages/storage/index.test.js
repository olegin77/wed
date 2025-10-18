import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { test } from "node:test";
import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { createS3Storage, StorageError } from "./index.js";

const BASE_CONFIG = {
  bucket: "media",
  region: "us-test-1",
  credentials: {
    accessKeyId: "AKIA_TEST",
    secretAccessKey: "secret",
  },
  publicUrlBase: "https://cdn.example.com/media",
};

class MockS3Client {
  constructor() {
    this.handlers = new Map();
  }

  on(CommandCtor, handler) {
    this.handlers.set(CommandCtor, handler);
    return this;
  }

  async send(command) {
    const handler = this.handlers.get(command.constructor);
    if (!handler) {
      throw new Error(`Unhandled command: ${command.constructor.name}`);
    }

    return handler(command);
  }
}

const streamToString = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? chunk : chunk.toString());
  }

  return chunks.join("");
};

test("validates configuration before creating the storage helper", () => {
  const client = new MockS3Client();

  assert.throws(
    () =>
      createS3Storage(
        {
          bucket: "",
          region: "",
          credentials: { accessKeyId: "", secretAccessKey: "" },
        },
        { client },
      ),
    (error) => error instanceof StorageError && error.code === "storage.invalid_config",
  );
});

test("uploads and retrieves objects while normalising keys and metadata", async () => {
  const client = new MockS3Client()
    .on(HeadBucketCommand, async () => ({}))
    .on(PutObjectCommand, async (command) => {
      assert.equal(command.input.Bucket, BASE_CONFIG.bucket);
      assert.equal(command.input.Key, "uploads/demo.txt");
      assert.equal(command.input.ContentType, "text/plain");
      assert.deepEqual(command.input.Metadata, { author: "codex" });
      return { ETag: '"etag-123"' };
    })
    .on(GetObjectCommand, async (command) => {
      assert.equal(command.input.Key, "uploads/demo.txt");
      return {
        Body: Readable.from(["payload"]),
        ContentLength: 7,
        ContentType: "text/plain",
        ETag: '"etag-123"',
        LastModified: new Date("2024-01-01T00:00:00Z"),
        Metadata: { author: "codex" },
      };
    });

  const storage = createS3Storage(BASE_CONFIG, { client });
  await storage.ensureBucket();

  const putResult = await storage.putObject({
    key: "/uploads/demo.txt",
    body: Buffer.from("payload"),
    contentType: "text/plain",
    metadata: { author: "codex" },
  });

  assert.deepEqual(putResult, { key: "uploads/demo.txt", etag: "etag-123" });

  const object = await storage.getObject({ key: "uploads/demo.txt" });
  assert.equal(await streamToString(object.body), "payload");
  assert.equal(object.contentLength, 7);
  assert.equal(object.contentType, "text/plain");
  assert.equal(object.etag, "etag-123");
  assert.deepEqual(object.metadata, { author: "codex" });
  assert.equal(object.lastModified?.toISOString(), "2024-01-01T00:00:00.000Z");

  assert.equal(
    storage.getPublicUrl("uploads/demo.txt"),
    "https://cdn.example.com/media/uploads/demo.txt",
  );
});

test("supports listing, copying, and deleting objects", async () => {
  let deletedKey = null;
  const client = new MockS3Client()
    .on(ListObjectsV2Command, async (command) => {
      assert.equal(command.input.Prefix, "exports/");
      assert.equal(command.input.MaxKeys, 2);
      return {
        Contents: [
          {
            Key: "exports/report.csv",
            Size: 120,
            ETag: '"etag-1"',
            LastModified: new Date("2024-02-01T00:00:00Z"),
          },
        ],
        IsTruncated: true,
        NextContinuationToken: "cursor-1",
      };
    })
    .on(CopyObjectCommand, async (command) => {
      assert.equal(command.input.CopySource, "media%2Fexports%2Freport.csv");
      assert.equal(command.input.Key, "archives/report.csv");
      assert.deepEqual(command.input.Metadata, { snapshot: "true" });
      assert.equal(command.input.MetadataDirective, "REPLACE");
      return {
        CopyObjectResult: {
          ETag: '"etag-copy"',
          LastModified: new Date("2024-02-02T00:00:00Z"),
        },
      };
    })
    .on(DeleteObjectCommand, async (command) => {
      deletedKey = command.input.Key;
      return {};
    });

  const storage = createS3Storage(BASE_CONFIG, { client });

  const listing = await storage.listObjects({ prefix: "exports/", maxKeys: 2 });
  assert.deepEqual(listing, {
    items: [
      {
        key: "exports/report.csv",
        size: 120,
        etag: "etag-1",
        lastModified: new Date("2024-02-01T00:00:00Z"),
      },
    ],
    nextCursor: "cursor-1",
  });

  const copyResult = await storage.copyObject({
    sourceKey: "exports/report.csv",
    destinationKey: "archives/report.csv",
    metadata: { snapshot: true },
  });

  assert.deepEqual(copyResult, {
    key: "archives/report.csv",
    etag: "etag-copy",
    lastModified: new Date("2024-02-02T00:00:00Z"),
  });

  await storage.deleteObject({ key: "archives/report.csv" });
  assert.equal(deletedKey, "archives/report.csv");
});

test("surfaces domain-specific errors", async () => {
  const notFoundClient = new MockS3Client().on(GetObjectCommand, async () => {
    const error = new Error("missing");
    error.name = "NoSuchKey";
    error.$metadata = { httpStatusCode: 404 };
    throw error;
  });

  const storage = createS3Storage(BASE_CONFIG, { client: notFoundClient });
  await assert.rejects(
    storage.getObject({ key: "unknown.txt" }),
    (error) => error instanceof StorageError && error.code === "storage.not_found",
  );

  let headCalls = 0;
  const ensureClient = new MockS3Client()
    .on(HeadBucketCommand, async () => {
      headCalls += 1;
      const error = new Error("missing");
      error.name = "NotFound";
      error.$metadata = { httpStatusCode: 404 };
      throw error;
    })
    .on(CreateBucketCommand, async (command) => {
      assert.equal(command.input.Bucket, BASE_CONFIG.bucket);
      return {};
    });

  const ensureStorage = createS3Storage(BASE_CONFIG, { client: ensureClient });
  await ensureStorage.ensureBucket();
  assert.equal(headCalls, 1);

  const strictEnsureClient = new MockS3Client().on(HeadBucketCommand, async () => {
    const error = new Error("missing");
    error.name = "NotFound";
    error.$metadata = { httpStatusCode: 404 };
    throw error;
  });

  const strictStorage = createS3Storage(BASE_CONFIG, { client: strictEnsureClient });
  await assert.rejects(
    strictStorage.ensureBucket({ createIfMissing: false }),
    (error) => error instanceof StorageError && error.code === "storage.ensure_bucket_failed",
  );
});
