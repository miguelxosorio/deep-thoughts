import React from 'react';
// importing the useQuery Hook from Apollo Client
import { useQuery } from '@apollo/client';
// imported the QUERY_THOUGHTS, QUERY_BASIC from queries.js
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
// thoughtlist
import Thoughtlist from '../components/Thoughtlist';
// friendlist
import FriendList from '../components/FriendList';
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

  // use object destructuring to extract 'data from the useQuery hook's response and rename it userData to be more descriptive
  // if the user is logged in and has a valid token, userData will hold all of the returned information from our query
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  // optional chaining
  // Optional chaining negates the need to check if an object even exists before accessing its properties
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  /* What we're saying is, if data exists, store it in the thoughts constant we just created. If data is undefined, then save an empty array to the thoughts component. */

  return (
    <main>
      <div className="flex-row justify-space-between">
        {/* we're conditionally defining the layout for this <div>, if logged in */}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {/* we use a ternary operator to conditionally render the <ThoughtList> component */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Thoughtlist
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
          {/* Once the query is complete and loading is undefined, we pass the thoughts array and a custom title to the <ThoughtList> component as props */}
          {/* if the value of loggedIn is true and there is data in the userData variable we created from the useQuery() Hook, we'll render a righthand column <div> that holds our <FriendList> component */}
        </div>
        {loggedIn && userData ? (
            <div className="col-12 col-lg-3 mb-3">
              <FriendList
                username={userData.me.username}
                friendCount={userData.me.friendCount}
                friends={userData.me.friends}
              />
            </div>
          ) : null}
      </div>
    </main>
  );
};

export default Home;
