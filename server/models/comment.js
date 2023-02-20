const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    }
})

// module.exports = mongoose.model('Comment', commentSchema)
module.exports = commentSchema