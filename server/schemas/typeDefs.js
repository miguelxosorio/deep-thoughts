// import the gql tagged template function
const { gql } = require('apollo-server-express');
// with GraphQL API access are split into 2 - QUERIES(GET) and MUTATIONS(POST PUT DELETE)

// setup of a GraphQL API involves defining two very important things
// Type Definitions - defining every piece of data that the client can expect to work with through a query or mutation
// Think of this as not only defining the API endpoint, but also defining the exact data and parameters that are tied to that endpoint
// Resolvers - functions we connect to each query or mutation type definition that perform the CRUD actions

// create our typeDefs
// Tagged templates are an advanced use of template literals
const typeDefs = gql`

  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
      _id: ID
      reactionBody: String
      createdAt: String
      username: String
  }

  type Query {
    thoughts(username: String): [Thought]
  }
`;

// export the typeDefs
module.exports = typeDefs;
