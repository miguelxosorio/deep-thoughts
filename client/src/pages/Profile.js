import React from 'react';

import { useParams } from 'react-router-dom';

import Thoughtlist from '../components/Thoughtlist';

import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';

const Profile = () => {

  // 1. The useParams Hook retrieves the username from the URL
  const { username: userParam } = useParams();

  // 2. which is then passed to the useQuery Hook
  const  { loading, data } = useQuery(QUERY_USER, {
    variables: { username: userParam }
  });

  // 3. The user object that is created afterwards is used to populate the JSX
  const user = data?.user || {};

  if(loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          {/* Viewing <usernames>'s profile. */}
          Viewing {user.username}'s profile.
        </h2>
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
        {/* PRINT THOUGHT LIST  */}
        <Thoughtlist thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>
        <div className="col-12 col-lg-3 mb-3">{/* PRINT FRIEND LIST */}</div>
      </div>
    </div>
  );
};

export default Profile;
