import React from 'react';

import { Redirect, useParams } from 'react-router-dom';
// Redirect allows us to redirect the user to another route within the application, like location.replace() but without the reloading

import Thoughtlist from '../components/Thoughtlist';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';

import Auth from '../utils/auth';

const Profile = () => {

  // 1. The useParams Hook retrieves the username from the URL
  const { username: userParam } = useParams();

  const [addFriend] = useMutation(ADD_FRIEND);

  // 2. which is then passed to the useQuery Hook
  const  { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  // 3. The user object that is created afterwards is used to populate the JSX
  const user = data?.me || data?.user || {};

  // Remember, when we run QUERY_ME, the response will return with our data in the me property; but if it runs QUERY_USER instead, the response will return with our data in the user property

  // redirect to personal profile page if username is the logged-in user's
  // with this we're checking to see if the user is logged in and if so, if the username stored in the JWT is the same as the userParam value
  // if they match, we return the <Redirect> comp as a prop to set to the value /profile
  if(Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  }

  if(loading) {
    return <div>Loading...</div>;
  }

  if(!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
      });
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          {/* Viewing <usernames>'s profile. */}
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

        {userParam && (
        <button className='btn ml-auto' onClick={handleClick}>
          Add Friend
        </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
        {/* PRINT THOUGHT LIST  */}
        <Thoughtlist thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>
        <div className="col-12 col-lg-3 mb-3">
        {/* PRINT FRIEND LIST */}
        <FriendList
          username={user.username}
          friendCount={user.friendCount}
          friends={user.friends}
          />
        </div>
      </div>
      <div className='mb-3'>{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
