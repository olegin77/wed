import assert from "node:assert/strict";
import { Readable } from "node:stream";
import test from "node:test";

import { chunkUpload, createMemoryTarget } from "./index";

test("splits stream into consistent chunks", async () => {
  const payload = Buffer.from("abcdefg");
  const target = createMemoryTarget();
  const source = Readable.from([payload]);

  const progress: number[] = [];
  const result = await chunkUpload({
    objectKey: "foo.bin",
    chunkSize: 3,
    source,
    target,
    onProgress: ({ size }) => progress.push(size),
  });

  assert.equal(result.parts.length, 3);
  assert.deepEqual(progress, [3, 3, 1]);
  const stored = target.dump("foo.bin");
  assert.equal(Buffer.concat(stored).toString(), "abcdefg");
});

test("aborts upload when target throws", async () => {
  const faultyTarget = {
    ...createMemoryTarget(),
    async uploadPart() {
      throw new Error("boom");
    },
  };

  const source = Readable.from([Buffer.from("hello")]);
  await assert.rejects(
    chunkUpload({
      objectKey: "faulty.bin",
      chunkSize: 2,
      source,
      target: faultyTarget,
    }),
    /boom/
  );
});
