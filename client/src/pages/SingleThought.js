import React from 'react';
// useParams
import { useParams } from 'react-router-dom';
// import useQuery() 
import { useQuery } from '@apollo/client';
// import QUERY_THOUGHT
import { QUERY_THOUGHT } from '../utils/queries';
// import reactionlist
import ReactionList from '../components/ReactionList';

const SingleThought = props => {
  const { id: thoughtId } = useParams();
  console.log(thoughtId)

  // variables loading and data are destructured from the useQuery Hook
  //  The loading variable is then used to briefly show a loading <div> element, and the data variable is used to populate a thought object
  // The useQuery Hook was given a second argument in the form of an object. This is how you can pass variables to queries that need them
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    // The id property on the variables object will become the $id parameter in the GraphQL query
    variables: { id: thoughtId }
  });

  const thought = data?.thought || {};

  if(loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>
      {/* adding the ReactionList component at the bottom, passing in the reactions array as a prop */}
      {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
    </div>
  );
};

export default SingleThought;
