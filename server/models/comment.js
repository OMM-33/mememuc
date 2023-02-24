const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    creatorName: {
        type: String,
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


Comment = mongoose.model('Comment', commentSchema)
module.exports = {
    Comment,
    commentSchema
}
