const postResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length,
    },
    // Comment: {
    //     commentTextLen: (parent) => {
    //         return `${parent.body.length}`
    //     }
    // },
    Query: {
        ...postResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentsResolvers.Mutation,
    },
    Subscription: {
        ...postResolvers.Subscription,
    }
}