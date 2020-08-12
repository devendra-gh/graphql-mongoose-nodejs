const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require('mongoose');

const { MONGODB } = require('./config');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');


// For PubSun Subcription
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB connected');
    return server.listen({ port: 5000 })
  }).then((response) => {
    console.log(`Server is running at ${response.url}`);
  });
