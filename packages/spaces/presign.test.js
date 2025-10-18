import assert from "node:assert/strict";
import { test } from "node:test";

import { presignPut } from "./presign.js";

/**
 * Temporarily mutates the selected environment variables while executing the
 * provided callback. The previous values are restored afterwards so tests stay
 * isolated.
 *
 * @param {Record<string, string | null>} tempEnv - Desired temporary values.
 * @param {() => void} fn - Callback executed with the patched environment.
 */
function withEnv(tempEnv, fn) {
  const previous = {};
  for (const key of Object.keys(tempEnv)) {
    previous[key] = process.env[key];
    const value = tempEnv[key];
    if (value === null) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    fn();
  } finally {
    for (const key of Object.keys(tempEnv)) {
      if (previous[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = previous[key];
      }
    }
  }
}

test("fails when Spaces credentials are missing", () => {
  withEnv(
    {
      SPACES_KEY: null,
      SPACES_SECRET: null,
      SPACES_BUCKET: null,
    },
    () => {
      assert.throws(
        () => presignPut({ key: "uploads/photo.jpg", contentType: "image/jpeg" }),
        /spaces_credentials_not_configured/
      );
    }
  );
});

test("generates a signed URL with normalized parameters", () => {
  withEnv(
    {
      SPACES_KEY: "TESTACCESSKEY",
      SPACES_SECRET: "supersecretvalue",
      SPACES_BUCKET: "wt-media",
      SPACES_REGION: "ams3",
    },
    () => {
      const { url, headers } = presignPut({
        key: " /album/hero image.jpg ",
        contentType: "image/jpeg",
      });

      const parsed = new URL(url);
      assert.equal(parsed.hostname, "wt-media.ams3.digitaloceanspaces.com");
      assert.equal(parsed.pathname, "/album/hero%20image.jpg");

      const algorithm = parsed.searchParams.get("X-Amz-Algorithm");
      assert.equal(algorithm, "AWS4-HMAC-SHA256");

      const credential = parsed.searchParams.get("X-Amz-Credential");
      assert.ok(credential?.startsWith("TESTACCESSKEY/"));

      assert.equal(parsed.searchParams.get("X-Amz-SignedHeaders"), "content-type;host;x-amz-content-sha256;x-amz-date");
      assert.ok(parsed.searchParams.get("X-Amz-Signature"));

      assert.equal(headers["Content-Type"], "image/jpeg");
      assert.equal(headers["x-amz-content-sha256"], "UNSIGNED-PAYLOAD");
      assert.match(headers["x-amz-date"], /^[0-9]{8}T[0-9]{6}Z$/);
    }
  );
});
