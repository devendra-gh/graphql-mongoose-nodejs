const gql = require("graphql-tag");

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createAt: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createAt: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    getPosts: [Post]
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
  }
`;

module.exports = typeDefs;
