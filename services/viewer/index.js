const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    viewer(token: String!): Viewer
  }

  type Viewer @key(fields: "id") {
    id: ID!
  }
`;

const resolvers = {
  Query: {
    viewer(object, args) {
      if (args.token !== 'secret') {
        throw new Error('invalid token');
      }
      return { id: 'viewerid' };
    }
  },
  // Viewer: {
  //   __resolveReference(...args) {
  //     return { id: 'vieweridfromref' };
  //   }
  // }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4005 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
