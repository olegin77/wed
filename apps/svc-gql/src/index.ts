export const schema = /* GraphQL */ `
  type Query {
    health: String!
  }
`;

export const resolvers = {
  Query: {
    health: () => "ok",
  },
};
