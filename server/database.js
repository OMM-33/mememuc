// This file handles the connection to and functionality for interacting with our MongoDB database and exports this for our server.

// Dotenv makes use of a .env file to store environment specific and potentially sensitive information.
// After import environment variables from dotenv can be imported via the syntax: process.env.VARIABLE_NAME
require('dotenv').config()

// Mongoose is a wrapper library for MongoDB allowing additional functionality such as data schemata
const mongoose = require('mongoose') // See  https://mongoosejs.com/
mongoose.set('strictQuery', true) // Suppresses a DeprecationWarning for a future change.
// multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
const multer = require('multer') // See https://github.com/expressjs/multer
// multer-gridfs-storage is a GridFS storage engine for multer to store uploaded files directly to MongoDb GridFS buckets
const {GridFsStorage} = require('multer-gridfs-storage') // See https://www.npmjs.com/package/multer-gridfs-storage

// This allows us to access the type of ObjectId as provided by mongoose like any other datatype.
const { ObjectId } = mongoose.Types

// Import our mongoose schemas
const Meme = require('./models/meme')
const {Layer} = require('./models/layer')
const {Media} = require('./models/media')
const {Comment} = require('./models/comment')
const {Vote} = require('./models/vote')
const User = require('./models/user')

// Use this line if you want to use the memory database instead of the persistent local database. (Needed for final submission.)
process.env.DATABASE_URL = process.env.MEMORY_DATABASE_URL

// Initialize Mongoose and connect to the MongoDB database as specified in the .env file (if it is specified).
if(!process.env.DATABASE_URL){
    console.error("No environment variable DATABASE_URL specified in .env file. Please add the URL of your MongoDB database for this project to file ./.env. Exiting...")
    process.exit()
}
mongoose.connect(process.env.DATABASE_URL)
// Save the connection for future access.
const connection = mongoose.connection

// Forward database errors to console for debugging.
connection.on('error', (e) => console.error(e))

// Upon successful database connection inform console and initialize the GridFS bucket.
let gfs
connection.once('open', () => {
    console.log('Connected to database.')
    gfs = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: process.env.GRIDFS_MEDIABUCKET
    })
})

// Create the GridFS storage engine for multer.
const storage = new GridFsStorage({
    url: process.env.DATABASE_URL,
    file: (req, file) => {
        return {
            filename: file.originalname, // As a name just pick the original filename
            bucketName: process.env.GRIDFS_MEDIABUCKET // The bucket we specified in our .env file
        }
    }
})

// Initialize multer with the above defined GridFS storage engine
const upload = multer({ storage })

// %%%%%%%%%%%%%
// % Functions %
// %%%%%%%%%%%%%
// Below are all the functions required to interact with the database.
// These will then be exposed via exports and available to the API endpoints.

// Builds a filter according to our retrieval design from parameters
async function buildFilter(userId=null, lastId=null, sortBy='updateDate', sortDir=-1, filterBy=null, filterOperator=null, filterValue=null) {
    let filter = {}
    if(userId){
        // If a userId exists (i.e. the user is authenticated), we want all public memes AND all private und unlisted memes of this user.
        filter = {
            $or: [
                { creatorId: ObjectId(userId), privacy: { $in: ['private', 'unlisted'] } },
                { privacy: 'public' }
            ]
        }
    } else {
        // If the userId doesn't exist we only want public memes.
        filter = { privacy: 'public' }
    }

    // If all additional filter params were given, we want to add these to the filter object 
    if(filterBy && filterOperator && filterValue){
        filter[filterBy] = {[filterOperator]: filterValue}
    }

    // If a lastId is specified, we want only objects that come after this according to 'sortBy'
    if (lastId) {
        const previousMeme = await Meme.findById(ObjectId(lastId))
        // ... so we filter by the sortBy field, where every object is either lesser or greater than the perviousMeme.
        // ... With the ternary operator we achieve the mapping of -1 -> $lt and 1 -> $gt
        filter[sortBy] = sortDir === -1 ? {$lt: previousMeme[sortBy]} : {$gt: previousMeme[sortBy]}
    }

    return filter
}

//     %%%%%%%%%%%%%%%%%%%
// ... % for meme access %
//     %%%%%%%%%%%%%%%%%%%

/** Function that lists all memes in the database, that fit the given parameters, in the given order.
 *  No parameters means list ALL memes.
 *  PLEASE do error handling wherever you call this!
 * 
 * @param userId The ObjectId of the user doing the search OR null if unauthenticated
 * @param limit The amount of results to receive. Null is all memes!
 * @param lastId The ObjectId of the last previous meme after which this list shall begin according to the specified params
 * @param sortBy The field to sort this list by
 * @param sortDir The direction to sort this list by
 * @param filterBy The field to filter this list by
 * @param filterOperator The operator to filter this list with
 * @param filterValue The value to apply the filter operator to
 */
async function listMemes(userId=null, limit=null, lastId=null, sortBy='updateDate', sortDir=-1, filterBy=null, filterOperator=null, filterValue=null) {
    // Build the sorting
    const sort = {[sortBy]: sortDir}

    // Build the filter using our helperFunction
    const filter = await buildFilter(userId, lastId, sortBy, sortDir, filterBy, filterOperator, filterValue)
    // console.log(`
    // ${filterBy}
    // ${filterOperator}
    // ${filterValue}
    // ${filter}
    // `)
    // Build the query 
    const query = Meme.find(filter).sort(sort)

    // If a limit was assigned, add it to the query
    if (limit) {
        query.limit(limit)
    }

    // Finally execute the query and return its result(s)
    return await query.exec()
}



// Returns the total count of memes
// ToDo: Only count memes user has auth for
async function countMemes(){
    return await Meme.countDocuments()
}

// Function that fetches one meme from the database as specified by its unique ID and sends it to the client.
// This ID can be found separately by searching the meme database or is returned upon saving a meme.
// IMO suboptimal practice to handle the response here, due to separation of concerns. Future TODO: Pull response back to routing.
async function getMemeById(id, res) {
    // Convert id string to ObjectId if possible
    let oid
    try { oid = ObjectId(id) }
    catch (err) {
        res.status(400).send(`ObjectId "${id}" is not valid. It must be a string of 12 bytes or a string of 24 hex characters or an integer.`)
        return
    }
    // Lookup meme id in database and return it. Error handling is to be done wherever called!
    return await Meme.findByIdAndUpdate(
        oid, // the ID of the meme
        { $inc: { viewCount: 1 } }, // increment the viewCount by 1
        { new: true } // finally return the updated object instead of the original
    )
    
}

// Returns the Id of a random meme
// TODO only return Ids out of the memes that the user is allowed to see.
async function getRandomMemeId() {
    // Here we receive a random meme Id by destructuring the object we get from Meme.aggregate
    // ... for the aggregate function, that allows to group, filter, transform, etc. data, we use the following operators:
    // ... $sample: returns random item(s) form the aggregation - amount specified by size object
    // ... $project: allows us to only receive the Id (as nothing else is needed). 
    const [{_id: randomMemeId}] = await Meme.aggregate([{$sample: {size: 1}}, {$project: {_id: 1}}]);
    return randomMemeId
}

// Get the meme after / before this one according to the specified query params
// ToDo Auth
async function getAdjacentMemeId(currentId, sortBy, direction){
    // Get the current value of the field to sort by
    const {[sortBy]: currentValue} = await Meme.findById(ObjectId(currentId), {[sortBy]: 1})
    // Build the query according to params
    const query = {[sortBy]: {[direction]: currentValue}}
    // Get the Id of the item fitting the query
    const adjacentMemeId = await Meme.findOne(query, {_id: 1})

    return adjacentMemeId
}

// Save a NEW meme to the database
// This will throw an error if validation fails! We catch this during routing in order to return it to the client for debugging their request.
async function saveMeme(meme) {
    // Replace layers in the meme with layers according to the layerSchema from models/layer.js
    if(meme.layers){    
        for (let i=0; i<meme.layers.length; i++) {
            meme.layers[i] = new Layer(meme.layers[i])
        }
    }
    // Create the meme according to the memeSchema from models/meme.js
    const memeToSave = new Meme(meme)
    // Finally save it and return the saved object
    const newMeme = await memeToSave.save()
    return newMeme
}

// Update a meme that already exists in the database (if it does indeed exist)
// This will throw an error if any validation (id, layer, meme) fails! We catch this during routing in order to return it to the client for debugging their request.
async function updateMeme(userData, id, meme) {
    const oid = ObjectId(id)

    // Search database if a meme for this id exists AND if it is created by the current user. Otherwise no update is possible and it throws an error.
    const existingMeme = await Meme.findOne({ _id: oid, creatorID: userData._id })
    if (!existingMeme) {
        throw new Error(`Meme ${id} not found or not created by user with ID ${userData._id}`)
    }

    // Replace layers in the meme with layers according to the layerSchema from models/layer.js
    if(meme.layers){    
        for (let i=0; i<meme.layers.length; i++) {
            meme.layers[i] = new Layer(meme.layers[i])
        }
    }
    // This options parameter tells Mongoose to return the updated object rather than the original object.
    const options = { new: true }
    
    const updatedMeme = await Meme.findByIdAndUpdate(oid, { $set: meme }, options)
    return updatedMeme
}

// Update a meme that already exists in the database (if it does indeed exist), REGARDLESS of creatorID. Should only be used by admins for content moderation.
// This will throw an error if any validation (id, layer, meme) fails! We catch this during routing in order to return it to the client for debugging their request.
async function updateMemeAdmin(id, meme) {
    const oid = ObjectId(id)

    // Replace layers in the meme with layers according to the layerSchema from models/layer.js
    if(meme.layers){    
        for (let i=0; i<meme.layers.length; i++) {
            meme.layers[i] = new Layer(meme.layers[i])
        }
    }
    // This options parameter tells Mongoose to return the updated object rather than the original object.
    const options = { new: true }
    
    const updatedMeme = await Meme.findByIdAndUpdate(oid, { $set: meme }, options)
    return updatedMeme
}

// Posts a comment to a meme
async function postComment(memeId, userId, userName, text){
    // Create the comment according to the schema
    const comment = new Comment({
        creatorID: ObjectId(userId),
        creatorName: userName,
        creationDate: Date.now(),
        content: text
    })

    // Find the meme
    const meme = await Meme.findById(ObjectId(memeId))

    if (!meme) { throw new Error(`Meme with ID ${memeId} not found`) }

    // Add comment and increment commentCount
    meme.comments.push(comment)
    meme.commentCount++

    const updatedMeme = await meme.save()
    return updatedMeme
}

// Casts a vote on a meme
async function castVote(memeId, userId, userName, voteValue){
    
    // Create the vote according to the schema
    const vote = new Vote({
        creatorID: ObjectId(userId),
        creatorName: userName,
        creationDate: Date.now(),
        value: voteValue
    })

    // Find the meme
    const meme = await Meme.findById(ObjectId(memeId))

    if (!meme) { throw new Error(`Meme with ID ${memeId} not found`) }

    // First check if there already is a vote with this userId:
    // If there is, the following function will return the index of it. If there isn't, it will be -1.
    const voteIndex = meme.votes.findIndex((v) => v.creatorID.equals(userId))

    if (voteIndex === -1) {
        // No votes where found, thus add the vote as new
        meme.votes.push(vote)
        meme.score += voteValue

    } else {
        // A previous vote was found, therefore we update it (and the score).
        const oldVote = meme.votes[voteIndex].value
        meme.votes[voteIndex] = vote
        meme.score += (voteValue - oldVote)
    }

    const updatedMeme = await meme.save()
    return updatedMeme
}

// The same as saveMeme, but with server-side rendering of the meme. Should only be used for the API.
// async function createMeme() {
//     // TODO
// }

//     %%%%%%%%%%%%%%%%%%%%
// ... % for media access %
//     %%%%%%%%%%%%%%%%%%%%

// Function that lists all media objects in the GridFS bucket, that fit the given parameters, in the given order.
// No parameters means list ALL media objects. Future TODO: Limit max objects returned per request and offer follow up requests (like pages).
// TODO: Limiting parameters
// TODO: Sorting
async function listMedia(host, filter) {
    let media
    if (filter) {
        // The following functions finds all media objects that correspond to the filter parameter,
        // ... then returns only the object ids according to the projection parameter "{_id: 1}"
        // ... and then unwraps these ids into an array with .map(), so that we can then use it to find all the corresponding data objects.
        const filteredMedia = (await Media.find(filter, {_id: 1})).map((doc) => doc._id)
        // Here we now use the above generated id array, in order to only return media data objects whose ids are within the array.
        media = await gfs.find({ _id: { $in: filteredMedia } }).toArray()
    } else {
        media = await gfs.find().toArray()
    }
    if (!media) { return }
    for (i = 0; i < media.length; i++) {
        media[i].mediaURL = `http://${host}/api/media/${media[i]._id}`
    }
    return media
}

// Function that fetches one media object from the GridFS bucket as specified by its unique ID and sends it to the client.
// This ID can be found by searching the media database (instead of the GridFS bucket) or is saved wherever the media is used (e.g. within a meme).
// IMO suboptimal practice to handle the response here, due to separation of concerns. Future TODO: Pull response back to routing.
async function getMediaById(id, res) {
    // Convert id string to ObjectId if possible
    let oid
    try { oid = ObjectId(id) }
    catch (err) {
        res.status(400).send(`ObjectId "${id}" is not valid. It must be a string of 12 bytes or a string of 24 hex characters or an integer.`)
        return
    }
    // Lookup media id in GridFS bucket and handle the (first) result directly in lambda callback
    await gfs.find({_id: oid}).next((err, media) => {
        if (err) { 
            // Error handling
            console.error('Failed retrieving media from GridFS, due to:\n' + err)
            res.status(500).send('Internal Server Error')
        } else if (!media) {
            // No media with this id was found
            res.status(404).send('Media Not Found')
        } else {
            // Media successfully found. Send it to client.
            // First set appropriate MIME type (e.g. image/jpeg or video/mp4)
            res.set('Content-Type', media.contentType)
            // The content disposition header tells the browser whether to display the file or to directly download it:
            // 'inline' = display, 'attachment' = download 
            // With the part starting with the semicolon we also give the media file its original name again (otherwise it will be the id)
            res.set('Content-Disposition', `inline; filename = "${media.filename}`)
            // Then open a download stream for the media file and pipe it to the response (as a writeable stream).
            gfs.openDownloadStream(media._id).pipe(res)
        }
    })
}

// Takes a meme ObjectId and returns the ObjectId of its current media representation
async function getMediaIdOfMemeId(id){
    const {mediaID: result} = await Meme.findById(ObjectId(id), {mediaID: 1})
    return result
}

// Function that saves additional metadata for files in the gridFS bucket in the 'normal' mongoDB database.
async function saveMediaMetadata(metadata){
    const media = new Media({
        _id: metadata.mediaID,
        creatorID: metadata.creatorID,
        creationDate: Date.now(),
        privacy: metadata.privacy,
        isTemplate: metadata.isTemplate,
        dataType: metadata.dataType
    })

    const newMedia = await media.save()
    return newMedia
}

/** Function that deletes one media object from the GridFS bucket as specified by its unique ID.
 * This ID can be found by searching the media database (instead of the GridFS bucket) or is saved wherever the media is used (e.g. within a meme).
 * @param {Boolean} metadata If metadata should be deleted as well. Default true. Mainly required to revoke a file upload before metadata was created.
 */ 
async function deleteMediaById(id, metadata=true) {
    try {
        // Delete the media file
        await gfs.delete(ObjectId(id))
        // Delete the media metadata
        if (metadata) { await Media.deleteOne({ _id: memeId }) }
        console.log(`Media file ${id} deleted.`)
    } catch (err) {
        console.error(`Could not delete media ${id}, due to error ${err}`)
        err.message = 'Media ' + err.message // Equals to Media File not found for id ...
        throw err
    }
}

//     %%%%%%%%%%%%%%%%%%%%%%%%%%%
// ... % for user authentication %
//     %%%%%%%%%%%%%%%%%%%%%%%%%%%

async function registerUser(name, password) {
    const user = new User({ name, password })
    await user.save()
}

async function getUser(name){
    return await User.findOne({name})
}

// %%%%%%%%%%%
// % Exports %
// %%%%%%%%%%%
// upload: Used to handle file uploads with multer
// Everything else: functions for database interaction as described above
module.exports = {
  upload,
  listMemes,
  countMemes,
  getMemeById,
  getRandomMemeId,
  getAdjacentMemeId,
  saveMeme,
  updateMeme,
  postComment,
  castVote,
  listMedia,
  getMediaById,
  getMediaIdOfMemeId,
  saveMediaMetadata,
  deleteMediaById,
  registerUser,
  getUser
}
