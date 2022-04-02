import React from 'react';
// importing the useQuery Hook from Apollo Client
import { useQuery } from '@apollo/client';
// imported the QUERY_THOUGHTS, QUERY_BASIC from queries.js 
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
// thoughtlist
import Thoughtlist from '../components/Thoughtlist';
// Auth
import Auth from '../utils/auth';

const Home = () => {
  // use useQuery hook to make query request
  //  Apollo's @apollo/client library provides a loading property to indicate that the request isn't done just yet
  // When it's finished and we have data returned from the server, that information is stored in the destructured data property.
  // with the loading property, we'll be able to conditionally render data based on whether or not there is data to even display.

  // Auth - If you're logged in, the loggedIn variable will be true; otherwise, it will be false
  const loggedIn = Auth.loggedIn();

  const { loading, data } = useQuery(QUERY_THOUGHTS);
  //  load the Home component in the application, we'll execute the query for the thought data

  // optional chaining
  // Optional chaining negates the need to check if an object even exists before accessing its properties
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  /* What we're saying is, if data exists, store it in the thoughts constant we just created. If data is undefined, then save an empty array to the thoughts component. */

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
        {/* we use a ternary operator to conditionally render the <ThoughtList> component */}
        {loading ? (
          <div>Loading...</div>
        ) : ( 
          <Thoughtlist thoughts={thoughts} title="Some Feed for Thought(s)..." />
        )}
        {/* Once the query is complete and loading is undefined, we pass the thoughts array and a custom title to the <ThoughtList> component as props */}
        </div>
      </div>
    </main>
  );
};

export default Home;
