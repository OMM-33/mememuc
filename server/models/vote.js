const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema({
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    positive: {
        type: Boolean,
        required: true,
        default: true
    }
})

// module.exports = mongoose.model('Vote', voteSchema)
module.exports = voteSchema