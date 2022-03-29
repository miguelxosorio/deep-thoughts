const { User, Thought } = require('../models');

const resolvers = {
  Query: {
    thoughts: async (parent, { username }) => {
      // use a ternary operator to check if username exists
      //If it does, we set params to an object with a username key set to that value. If it doesn't, we simply return an empty object
      const params = username ? { username } : {};
      // then pass that object, with or without any data in it, to our .find() method
      // If there's data, it'll perform a lookup by a specific username. If there's not, it'll simply return every thought
      return Thought.find(params).sort({ createdAt: -1 });
    },
  },
};

module.exports = resolvers;

// a resolver can accept 4 args in the ff order
// parent: This is if we used nested resolvers to handle more complicated actions, as it would hold the reference to the resolver that executed the nested resolver function
// args: This is an object of all of the values passed into a query or mutation request as parameters.  In our case, we destructure the username parameter out to be used.
// context:  This will come into play later. If we were to need the same data to be accessible by all resolvers, such as a logged-in user's status or API access token, this data will come through this context parameter as an object
// info: This will contain extra information about an operation's current state. This isn't used as frequently, but it can be implemented for more advanced uses.