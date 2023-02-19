const mongoose = require('mongoose')
// Import other schemas that are used within this one.
const Media = require('./media')

const layerSchema = new mongoose.Schema({
    layerType: {
        type: String,
        enum: ['image', 'gif', 'video', 'text'],
        required: true
    },
    origin: {
        x: {
            type: Number,
            required: true,
            default: 0.5
        },
        y: {
            type: Number,
            required: true,
            default: 0.5
        },
    },
    rotation: {
        type: Number,
        required: true,
        default: 0
    },
    scale: {
        x: {
            type: Number,
            required: true,
            default: 0.33
        },
        y: {
            type: Number,
            required: true,
            default: 0.33
        },
    },
    opacity: {
        type: Number,
        required: true,
        default: 1,
        min: 0,
        max: 1
    },
    options: {
        mediaID: {
            type: mongoose.Schema.Types.ObjectId,
            required: false
        },
        fit: {
            type: Number,
            enum: [0,1,2],
            required: false,
            default: 0
        },
        flip: {
            type: Boolean,
            required: false,
            default: false
        },
        text: {
            type: String,
            required: false
        },
        font: {
            size: {
                type: Number,
                required: false,
                default: 64,
                min: 1
            },
            color: {
                type: String,
                required: false,
                default: '#ffffff'
            },
            colorStroke: {
                type: String,
                required: false,
                default: '#000000'
            },
            colorBackground: {
                type: String,
                required: false
            },
            align: {
                type: Number,
                enum: [0,1,2],
                required: false,
                default: 1
            }
        }
    }
})

module.exports = mongoose.model('Layer', layerSchema)