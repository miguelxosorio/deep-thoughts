import React from 'react';
// Apollo import
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// retrieve token from localStorage and include it with request to the API - every time make a GraphQL request
import { setContext } from '@apollo/client/link/context';
// setContext we can create a middleware function that will retrieve the token for us and combine it with existing httpLink

// react-router-dom BrowserRouter(renamed to Router) and Route - components that the React Router library provides
// Switch would reroute it to display error or page not found when route is non existent
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Page Components
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

// first establish a new link to the GraphQL server at its /graphql endpoint with createHttpLink()
const httpLink = createHttpLink({
  uri: '/graphql',
});

// we use the setContext() function to retrieve the token from localStorage and set the HTTP request headers of every request to include the token
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
})

// when a user signs up or logs in and receives an access token in return, we store it in localStorage. With this token, we can decode it to retrieve the logged-in user's nonsensitive data, check if the token is still valid, and use it to make requests to the server.
// Any time we make a request to the server, we use the code we just implemented a few moments ago to automatically set the HTTP request headers with our token
// This way, our server can receive the request, check the token's validity, and allow us to continue our request if it is

// After we create the link, we use the ApolloClient() constructor to instantiate the Apollo Client instance and create the connection to the API endpoint
const client = new ApolloClient({
  // link: httpLink,
  link: authLink.concat(httpLink), // combine the authLink and httpLink objects so that every request retrieves the token and sets the request headers before making the request to the API
  //  also instantiate a new cache object using new InMemoryCache()
  cache: new InMemoryCache(),
})

function App() {
  // Note how we wrap the entire returning JSX code with <ApolloProvider>. Because we're passing the client variable in as the value for the client prop in the provider,
  // everything between the JSX tags will eventually have access to the server's API data through the client we set up.
  return (
  <ApolloProvider client={client}>
    <Router>
      <div className='flex-column justify-flex-start min-100-vh'>
        <Header />
        <div className='container'>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          {/* updated paths from thoughtlist comp */}
          {/*  ? means this parameter is optional, so /profile and /profile/myUsername will both render the Profile component */}
          <Route exact path="/profile/:username?" component={Profile} />
          <Route exact path="/thought/:id" component={SingleThought} />

          <Route component={NoMatch} />
        </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  </ApolloProvider>
  );
}

export default App;

// ApolloProvider is a special type of React component that we'll use to provide data to all of the other components
// ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server
// InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently
// createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests