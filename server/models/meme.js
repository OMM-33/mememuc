const mongoose = require('mongoose')
// Import other schemas that are used within this one.
const Vote = require('./vote')
const Media = require('./media')
const Layer = require('./layer')
const Comment = require('./comment')

const memeSchema = new mongoose.Schema({
    mediaID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'untitled'
    },
    description: {
        type: String,
        required: true,
        default: 'This meme lacks a creator-given description. Although we are sure it is very funny and might even contain cats.'
    },
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: [Vote],
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
        type: [Comment],
        required: true,
        default: []
    },
    background: {
        media: {
            type: Media,
            required: false
        },
        color: {
            type: String,
            required: true,
            default: '#ffffff'
        }
    },
    layers: {
        type: [Layer],
        required: false
    }
})

module.exports = mongoose.model('Meme', memeSchema)