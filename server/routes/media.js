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
// Query Params:
// /api/media/list                  > returns everything
// /api/media/list?templates=true   > returns ONLY templates
// /api/media/list?templates=false  > returns everything EXCEPT templates (also for any other value of templates other than true)
router.get('/list', async (req, res) => {
    try {
        let media
        if (req.query.templates) {
            const getTemplates = (req.query.templates === 'true')
            // console.log('Casted ' + req.query.templates + ' to ' + typeof getTemplates + ' ' + String(getTemplates)) // Debugging Boolean casts (ty JS!)

            // Returns either ONLY templates or ONLY non-templates, depending on the value of getTemplates
            media = await database.listMedia(req.headers.host, {isTemplate: getTemplates})

        } else {
            // Because no value was specified for query param 'templates', we return everything(!)
            media = await database.listMedia(req.headers.host)
        }

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
router.post('/', database.upload.single('mediaFile'), async (req, res) => {
    const oid = String(req.file.id)
    console.log('Successfully uploaded mediaFile to gridFS with ObjectId ' + oid)
    res.status(201).json({
        message: 'File uploaded successfully',
        mediaID: oid,
        mediaURL: `http://${req.headers.host}/api/media/${oid}`
    })

    const metadata = {
        mediaID: oid,
        creatorID: '000000000000000000000000', // Placeholder. TODO: Replace with function that fetches user ID from the request. Possible as soon as auth is running.,
        privacy: req.body.privacy || 'public',
        isTemplate: req.body.isTemplate !== 'false',
        dataType: req.file.contentType
    }

    const newMedia = await database.saveMediaMetadata(metadata)
    console.log('Metadata for new media object: ' + newMedia)
})

// Delete the media file with the specified id (if it exists)
// TODO: Auth (isAdmin || isCreator)
// TODO: Usage check (If still used replace w/ placeholder in all used places)
router.delete('/:id', async (req, res) => {
    // Try deleting the file and send success or error response according to if it succeeds.
    try {
        await database.deleteMediaById(req.params.id)
        res.status(200).send(`Media file ${id} successfully deleted.`)
    } catch (err) {
        console.error(`Error deleting media file ${id}, due to: ${err}`)
        res.status(400).send(err.message)
    }
})

// Update media
// TODO (necessary?)
// router.put('/:id', (req, res) => {

// })

module.exports = router
