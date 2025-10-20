# GraphQL Gateway Skeleton

- **Schema export:** `apps/svc-gql/src/index.ts` exposes the schema as a `/* GraphQL */` string for easy ingestion by server frameworks.
- **Resolvers:** The exported `resolvers` object contains the minimal `Query.health` resolver returning `"ok"`.
- **Extending the gateway:** Add new types and resolvers next to the skeleton and compose them in the HTTP server (not yet implemented).
- **Health probe:** The `health` query doubles as a readiness probe for the gateway deployment during the bootstrap stage.
