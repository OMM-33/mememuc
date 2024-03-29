const mongoose = require('mongoose')
// Import other schemas that are used within this one.
const {voteSchema} = require('./vote')
const {layerSchema} = require('./layer')
const {commentSchema} = require('./comment')

const memeSchema = new mongoose.Schema({
    mediaID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    mediaURL: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'untitled'
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // Name of the meme's creator
    // Future ToDo: Remove this field and replace it with a user._id -> user.name lookup where required.
    // ... This removes redundancy and allows everything to listen to changes in user.name (Not possible for the current system though).
    creatorName: {
        type: String,
        required: true
    },
    updateDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    privacy: {
        type: String,
        enum: ['private', 'unlisted', 'public'],
        required: true,
        default: 'private'
    },
    viewCount: {
        type: Number,
        required: true,
        default: 0
    },
    votes: {
        type: [voteSchema],
        required: true,
        default: []
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    commentCount: {
        type: Number,
        required: true,
        default: 0
    },
    comments: {
        type: [commentSchema],
        required: true,
        default: []
    },
    background: {
        mediaSource: {
            type: String,
            required: false
        },
        color: {
            type: String,
            required: true,
            default: '#ffffff'
        }
    },
    layers: {
        type: [layerSchema],
        required: false
    }
})

module.exports = mongoose.model('Meme', memeSchema)
