// Handling the api routes interacting with media objects
// Using the express Router library
const express = require('express')
const router = express.Router()
// Import our database
const database = require('../database');


// Get a list of media, limited by parameters and sorted accordingly.
// TODO: Limiting parameters
// TODO: Sorting
// See also database.js > listMedia()
router.get('/list', async (req, res) => {
    try {
        const media = await database.listMedia();
        res.status(200).json(media);
    } catch (err) {
        res.status(500).json({ message: 'Error listing files: ' + err.message });
    }
});

// Get the media
router.get('/:id', async (req, res) => {
    console.log('Getting file with id: ' + req.params.id)
    try {
        database.getMediaById(req.params.id, res);
    } catch (err) {
        res.status(500).json({ message: 'Error sending file: ' + err });
    }
})

// Get command overview
// TODO: Actually implement an overview
router.get('/', (req, res) => {
    res.send('Overview of media API')
})


// Save uploaded media to database
// The file upload is handled as middleware *before* the main route handler function (i.e. (req, res) => {...}).
// This way all necessary preprocessing can be handled before we want interact to interact with the file itself.
router.post('/', database.upload.single('mediaFile'), (req, res) => {
    res.status(201).json({ message: 'File uploaded successfully' });
});

// Update media
router.put('/:id', (req, res) => {

})

// Delete media
router.delete('/:id', (req, res) => {

})

module.exports = router