// Handling the api routes interacting with media objects
// Using the express Router library
const express = require('express')
const router = express.Router()
// Import our database
const database = require('../database')


// Get a list of media, limited by parameters and sorted accordingly.
// TODO: Limiting parameters
// TODO: Sorting
// See also database.js > listMedia()
router.get('/list', async (req, res) => {
    try {
        const media = await database.listMedia(req.headers.host)
        res.status(200).json(media)
    } catch (err) {
        res.status(500).json({ message: 'Error listing files: ' + err.message })
    }
})

// Get the media with the specified id (if it exists)
// TODO: Auth (isPublic || isAdmin || isCreator)
router.get('/:id', async (req, res) => {
    console.log('Getting file with id: ' + req.params.id) // Debugging
    try {
        database.getMediaById(req.params.id, res)
    } catch (err) {
        res.status(500).json({ message: 'Error sending file: ' + err })
    }
})

// Get command overview
// TODO: Actually implement an overview
router.get('/', (req, res) => {
    res.send('Overview of media API')
})

// Upload a media file and save it to the database
// The file upload is handled as middleware *before* the main route handler function (i.e. (req, res) => {...}).
// This way all necessary preprocessing can be handled before further interaction with the file itself.
router.post('/', database.upload.single('mediaFile'), (req, res) => {
    const oid = String(req.file.id)
    console.log('Successfully uploaded mediaFile to gridFS with ObjectId ' + oid)
    res.status(201).json({
        message: 'File uploaded successfully',
        mediaID: oid,
        mediaURL: `http://${req.headers.host}/api/media/${oid}`
    })
})

// Delete the media file with the specified id (if it exists)
// TODO: Auth (isAdmin || isCreator)
// TODO: Usage check (If still used replace w/ placeholder in all used places) 
router.delete('/:id', (req, res) => {
    database.deleteMediaById(req.params.id, res)
})

// Update media
// TODO (necessary?)
// router.put('/:id', (req, res) => {

// })

module.exports = router
