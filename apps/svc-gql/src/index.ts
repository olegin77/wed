/**
 * Minimal GraphQL schema exposed by the gateway stub. The schema is exported as
 * a string so the HTTP server can feed it directly into `graphql-js` or Apollo.
 */
export const schema = /* GraphQL */ `
  type Query {
    health: String!
  }
`;

/**
 * Resolver map for the skeleton gateway. Each resolver is intentionally tiny so
 * downstream services can replace them while retaining the typing contract.
 */
export const resolvers = {
  Query: {
    health: () => "ok" as const,
  },
};
