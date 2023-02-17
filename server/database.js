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
const { ObjectId } = mongoose.Types;

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
let gfs;
connection.once('open', () => {
    console.log('Connected to database.')
    gfs = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: process.env.GRIDFS_MEDIABUCKET
    });
})

// Create the GridFS storage engine for multer.
const storage = new GridFsStorage({
    url: process.env.DATABASE_URL,
    file: (req, file) => {
        return {
            filename: file.originalname, // As a name just pick the original filename
            bucketName: process.env.GRIDFS_MEDIABUCKET // The bucket we specified in our .env file
        };
    }
});

// Initialize multer with the above defined GridFS storage engine
const upload = multer({ storage });

// %%%%%%%%%%%%%
// % Functions %
// %%%%%%%%%%%%%
// Below are all the functions required to interact with the database.
// These will then be exposed via exports and available to the API endpoints.

async function getAllFiles() {
    const files = await gfs.find().toArray();
    return files;
}

async function sendFileById(id, res) {
    const file = await gfs.find({_id: ObjectId(id)}).toArray();
  
    if (!file || file.length === 0) {
          return res.status(404).json({ message: "File not found" });
    }
  
    const readStream = gfs.openDownloadStream(ObjectId(id));
    res.set("Content-Type", file[0].contentType);
    res.set("Content-Disposition", `attachment; filename="${file[0].filename}"`);
    readStream.pipe(res);
}

// %%%%%%%%%%%
// % Exports %
// %%%%%%%%%%%
// upload: Used to handle file uploads with multer
// Everything else: functions for database interaction as described above
module.exports = {
  upload,
  getAllFiles,
  sendFileById
};
