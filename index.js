const { ApolloServer } = require("apollo-server");
const { graphql } = require("graphql-tag");

const typeDefs = gql`
  type Query {
    sayHi: String!
  }
`;

const resolvers = {
  Query: {
    sayHi: () => {
      return "Hello World!";
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen({ port: 5000 }).then((response) => {
  console.log(`Server is running at ${response.url}`);
});
