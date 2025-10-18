import crypto from "crypto";

function hmac(key: string, data: string) {
  return crypto.createHmac("sha256", key).update(data).digest();
}

function hexhmac(key: crypto.BinaryLike | NodeJS.ArrayBufferView, data: string) {
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}

function encodeRfc3986(value: string): string {
  return encodeURIComponent(value).replace(/[!*'()]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function canonicaliseKey(key: string): string {
  return key
    .split("/")
    .map((segment) => encodeRfc3986(segment))
    .join("/");
}

export function presignPut({
  key,
  contentType,
  payloadHash,
}: {
  key: string;
  contentType: string;
  payloadHash?: string;
}) {
  const access = process.env.SPACES_KEY || "";
  const secret = process.env.SPACES_SECRET || "";
  const region = process.env.SPACES_REGION || "ams3";
  const bucket = process.env.SPACES_BUCKET || "wt-media";
  const host = `${bucket}.${region}.digitaloceanspaces.com`;
  const service = "s3";
  const algorithm = "AWS4-HMAC-SHA256";
  const amzdate = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z/, "Z");
  const datestamp = amzdate.slice(0, 8);
  const credentialScope = `${datestamp}/${region}/${service}/aws4_request`;
  const hashedPayload = payloadHash ?? "UNSIGNED-PAYLOAD";
  const canonicalKey = canonicaliseKey(key);
  const headerEntries: Array<[string, string]> = [
    ["host", host],
    ["x-amz-content-sha256", hashedPayload],
    ["x-amz-date", amzdate],
  ];
  headerEntries.sort(([a], [b]) => a.localeCompare(b));
  const canonicalHeaders = `${headerEntries
    .map(([name, value]) => `${name}:${value}`)
    .join("\n")}\n`;
  const signedHeaders = headerEntries.map(([name]) => name).join(";");
  const queryEntries: Array<[string, string]> = [
    ["X-Amz-Algorithm", algorithm],
    ["X-Amz-Credential", `${access}/${credentialScope}`],
    ["X-Amz-Date", amzdate],
    ["X-Amz-Expires", "300"],
    ["X-Amz-SignedHeaders", signedHeaders],
  ];
  queryEntries.sort(([a], [b]) => a.localeCompare(b));
  const canonicalQueryString = queryEntries
    .map(([name, value]) => `${encodeRfc3986(name)}=${encodeRfc3986(value)}`)
    .join("&");
  const canonicalRequest = `PUT\n/${canonicalKey}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedPayload}`;
  const stringToSign = `${algorithm}\n${amzdate}\n${credentialScope}\n${crypto
    .createHash("sha256")
    .update(canonicalRequest)
    .digest("hex")}`;
  const kDate = hmac(`AWS4${secret}`, datestamp);
  const kRegion = hmac(kDate as any, region);
  const kService = hmac(kRegion as any, service);
  const kSigning = hmac(kService as any, "aws4_request");
  const signature = hexhmac(kSigning as any, stringToSign);
  const queryString = `${canonicalQueryString}&X-Amz-Signature=${signature}`;
  const url = `https://${host}/${canonicalKey}?${queryString}`;
  return {
    url,
    headers: {
      "x-amz-date": amzdate,
      Host: host,
      "Content-Type": contentType,
      "x-amz-content-sha256": hashedPayload,
    },
  };
}
