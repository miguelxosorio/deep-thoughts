import React from 'react';
// Apollo import
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

// first establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink()
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

// After we create the link, we use the ApolloClient() constructor to instantiate the Apollo Client instance and create the connection to the API endpoint
const client = new ApolloClient({
  link: httpLink,
  //  also instantiate a new cache object using new InMemoryCache()
  cache: new InMemoryCache(),
})

function App() {
  // Note how we wrap the entire returning JSX code with <ApolloProvider>. Because we're passing the client variable in as the value for the client prop in the provider,
  // everything between the JSX tags will eventually have access to the server's API data through the client we set up.
  return (
  <ApolloProvider client={client}>
    <div className='flex-column justify-flex-start min-100-vh'>
      <Header />
      <div className='container'>
        <Home />
      </div>
      <Footer />
    </div>
  </ApolloProvider>
  );
}

export default App;

// ApolloProvider is a special type of React component that we'll use to provide data to all of the other components
// ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server
// InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently
// createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests