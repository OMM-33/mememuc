const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // Future ToDo: Remove this field and replace it with a user._id -> user.name lookup where required.
    // ... This removes redundancy and allows everything to listen to changes in user.name (Not possible for the current system though).
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
