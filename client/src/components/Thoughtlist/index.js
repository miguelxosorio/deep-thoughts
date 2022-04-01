import React from 'react';
import { Link } from 'react-router-dom';

//  We destructure the argument data to avoid using props.title and props.thoughts throughout the JSX code
const Thoughtlist = ({ thoughts, title }) => {
  if (!thoughts.length) {
    return <h3>No Thoughts</h3>;
  }
  // Here we instruct that the ThoughtList component will receive two props: a title and the thoughts array
  return (
    <div>
      <h3>{title}</h3>
      {thoughts &&
        thoughts.map(thought => (
          <div key={thought._id} className="card mb-3">
            <p className="card-header">
              <Link
                to={`/profile/${thought.username}`}
                style={{ fontWeight: 700 }}
                className="text-light"
              >
                {thought.username}
              </Link>{' '}
              thought on {thought.createdAt}
            </p>
            <div className="card-body">
              <Link to={`/thought/${thought._id}`}>
                <p>{thought.thoughtText}</p>
                <p className="mb-0">
                  Reactions: {thought.reactionCount} || Click to{' '}
                  {thought.reactionCount ? 'see' : 'start'} the discussion!
                </p>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Thoughtlist;
