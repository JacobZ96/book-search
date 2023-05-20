const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolver ={
    Query: {},
    Mutation: {}
};

module.exports = resolvers;