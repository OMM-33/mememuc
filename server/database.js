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

//     %%%%%%%%%%%%%%%%%%%%
// ... % for media access %
//     %%%%%%%%%%%%%%%%%%%%

// Function that lists all media objects in the GridFS bucket, that fit the given parameters, in the given order.
// No parameters means list ALL media objects. Future TODO: Limit max objects returned per request and offer follow up requests (like pages).
// TODO: Limiting parameters
// TODO: Sorting
async function listMedia() {
    const files = await gfs.find().toArray()
    return files
}

// Function that fetches one media object from the GridFS bucket as specified by its unique ID and sends it to the client.
// This ID can be found by searching the media database (instead of the GridFS bucket) or is saved wherever the media is used (e.g. within a meme).
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

// %%%%%%%%%%%
// % Exports %
// %%%%%%%%%%%
// upload: Used to handle file uploads with multer
// Everything else: functions for database interaction as described above
module.exports = {
  upload,
  listMedia,
  getMediaById
}
