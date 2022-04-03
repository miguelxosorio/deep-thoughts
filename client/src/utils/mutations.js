import { gql } from '@apollo/client';

// import the gql tagged template literal functionality to create a GraphQL mutation called login
// This will accept two variables, $email and $password, whose values we'll set up to be passed in as arguments when we integrate this with the login form page
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// import the gql tagged template literal functionality to create a GraphQL mutation called addUser
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
