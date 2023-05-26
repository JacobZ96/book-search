const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers ={
    Query: {
        // users: async () => {
        //     return User.find().populate('books');
        // },
        // user: async (parent, {username}) => {
        //     return User.findOne({username}).populate('books');
        // } ,  
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id})
                .select('-__v -password')
                .populate('books')
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        }

    },
    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return {token, user};
        },

        addUser: async (parent, { username, email,password }) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);
            return {token, user};
        },

        saveBook: async (parent, {bookData}, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$push: {savedBooks: bookData}},
                    {new: true}
                );
                return updatedUser;
            }
        },
        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
                return User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId}}},
                    {new: true}
                );
            }
        }
    }
};

module.exports = resolvers;