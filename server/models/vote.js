const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema({
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
