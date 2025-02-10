require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDefs'); // Create this file with your GraphQL schema
const resolvers = require('./graphql/resolvers'); // Your GraphQL resolver functions

async function startServer() {
  const app = express();
  app.use(cors());
  
  // Initialize Apollo Server with your schema, resolvers, and context (if needed)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Optionally extract auth information from request headers
      return { req };
    }
  });
  
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' }); // GraphQL endpoint

  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`GraphQL API is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();