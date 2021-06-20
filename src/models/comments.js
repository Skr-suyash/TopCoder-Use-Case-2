/**
 * Comments Model
 */
const mongoose = require('mongoose');

// Schema for adding the replies
const replySchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        default: 'User',
    },
    role: {
        type: String,
        default: 'Student',
    },
    body: {
        type: String,
        required: true,
    },
});

const commentSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
        default: 'User',
    },
    role: {
        type: String,
        default: 'Student',
    },
    body: {
        type: String,
        required: true,
    },
    pageNumber: {
        type: Number,
    },
    replies: [replySchema],
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
