require('dotenv').config();
const jwt = require('jsonwebtoken');
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
      // Check for auth token in request headers.
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      let user;

      if (token) {
        try {
          user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          console.error('Invalid token', err);
        }
      }

      // Fallback: provide a default test doctor user if none is authenticated.
      if (!user) {
        user = {
          id: "D1",
          email: "doctor@test.com",
          role: "DOCTOR",
          name: "Dr. Test",
          specialization: "General Medicine",
          licenseNumber: "TEST123",
          createdAt: new Date().toISOString()
        };
      }
      return { req, user };
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