const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    // QUERY
  Query: {
    me: async(parent, args, context) => {
        // check for the existence of context.user. If no context.user property exists, then we know that the user isn't authenticated and we can throw an AuthenticationError.
        if(context.user) {
        const userData = await User.findOne({})
        .select('-__v -password')
        .populate('thoughts')
        .populate('friends');

        return userData;
        }

        throw new AuthenticationError('Not logged in');
    },
    thoughts: async (parent, { username }) => {
      // use a ternary operator to check if username exists
      //If it does, we set params to an object with a username key set to that value. If it doesn't, we simply return an empty object
      const params = username ? { username } : {};
      // then pass that object, with or without any data in it, to our .find() method
      // If there's data, it'll perform a lookup by a specific username. If there's not, it'll simply return every thought
      return Thought.find(params).sort({ createdAt: -1 });
    },
    // place this inside of the `Query` nested object right after `thoughts`
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    // get all users
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
  },

  // MUTATIONS
  Mutation: {
    addUser: async (parent, args) => {
      // Mongoose User model creates a new user in the database with whatever is passed in as the args
      const user = await User.create(args);
      //  sign a token and return an object that combines the token with the user's data
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
        
        const user = await User.findOne({ email });

        if(!user) {
            throw new AuthenticationError('Incorrect credentials')
        }

        const correctPw = await user.isCorrectPassword(password);

        if(!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
        }
        const token = signToken(user);
        return { token, user };
    },
    addThought: async (parent, args, context) => {
        // Only logged-in users should be able to use this mutation, hence why we check for the existence of context.user first
        if(context.user) {
            const thought = await Thought.create({ ...args, username: context.user.username });

            await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { thoughts: thought._id } },
                { new: true }
            );

            return thought;
        }

        throw new AuthenticationError('You need to be logged in');
    },
    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
        if(context.user) {
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: thoughtId },
                { $push: { reactions: { reactionBody, username: context.user.username} } },
                { new: true, runValidators: true }
            );

            return updatedThought
        }

        throw new AuthenticationError('You need to be logged in');
    },
    addFriend: async (parent, { friendId }, context) => {
        if(context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user_id },
                { $addToSet: { friends: friendId } },
                { new: true }
            ).populate('friends');

            return updatedUser;
        }

        throw new AuthenticationError('You need to be logged in!');
    }
  },
};

module.exports = resolvers;

// a resolver can accept 4 args in the ff order
// parent: This is if we used nested resolvers to handle more complicated actions, as it would hold the reference to the resolver that executed the nested resolver function
// args: This is an object of all of the values passed into a query or mutation request as parameters.  In our case, we destructure the username parameter out to be used.
// context:  This will come into play later. If we were to need the same data to be accessible by all resolvers, such as a logged-in user's status or API access token, this data will come through this context parameter as an object
// info: This will contain extra information about an operation's current state. This isn't used as frequently, but it can be implemented for more advanced uses.
