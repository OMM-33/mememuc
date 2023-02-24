const mongoose = require('mongoose')

// This is a schema describing a media object of our database
// A media object holds one media object (img, gif, video) and it's metadata
const mediaSchema = new mongoose.Schema({
    // Since we want this metadata object to have the same ID as the media object in the gridFS database, we declare the _id explicitly here.
    // This way we can declare it upon creation as the same ID for the media object already created.
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // An optional title for the media object, helping with searchability
    title: {
        type: String,
        required: false
    },
    // Unique identifier of this media object's creator
    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // Name of the media object's creator
    // Future ToDo: Remove this field and replace it with a user._id -> user.name lookup where required.
    // ... This removes redundancy and allows everything to listen to changes in user.name (Not possible for the current system though).
    creatorName: {
        type: String,
        required: true
    },
    // Date this media was created at
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    // Source of this media object
    source: {
        // How this media object came to be (e.g. import, created, etc.)
        description: {
            type: String,
            required: false
        },
        // If available, the URL of the media object source (e.g. the website it was imported from)
        url: {
            type: String,
            required: false
        }
    },
    // Whether this media object is visible to everyone or only the creator
    privacy: {
        type: String,
        enum: ['private', 'unlisted', 'public'],
        required: true,
        default: 'public'
    },
    // Whether this media object should be available as a meme template (upon which a meme can be created) instead of just importable into an existing meme
    isTemplate: {
        type: Boolean,
        required: true,
        default: false
    },
    // The data type of this media object (i.e. image, gif or video)
    dataType: {
        type: String,
        //enum: ["image", "gif", "video"],
        required: true
    }
})

Media = mongoose.model('Media', mediaSchema)
module.exports = {
    Media,
    mediaSchema
}
