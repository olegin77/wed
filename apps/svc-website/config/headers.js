module.exports = async () => [
  { source: "/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=60" }] }
];
