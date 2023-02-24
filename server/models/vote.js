const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema({
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
    creatorName: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    value: {
        type: Number,
        enum: [-1, 1],
        required: true,
        default: 1
    }
})

Vote = mongoose.model('Vote', voteSchema)
module.exports = {
    Vote,
    voteSchema
}
