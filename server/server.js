const express = require('express');
// path
const path = require('path');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// authMiddleware
const { authMiddleware } = require('./utils/auth');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  // create a new Apollo server and pass in our schema data
  // provide the type definitions and resolvers so they know what our API looks like and how it resolves requests
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  });

  // Start the Apollo server
  await server.start();

  // integrate Apollo server with the Express application as middleware
  // This will create a special /graphql endpoint for the Express.js server that will serve as the main endpoint for accessing the entire API
  server.applyMiddleware({ app });

  // log where we can go to test GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// initialize the Apollo Server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serve up static assets
// will only come into effect when we go into production
// First, we check to see if the Node environment is in production. If it is, we instruct the Express.js server to serve any files in the React application's build directory in the client folder
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// wildcard GET route for the server
// if we make a GET request to any location on the server that doesn't have an explicit route defined, respond with the production-ready React front-end code
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
