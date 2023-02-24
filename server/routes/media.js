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
// It's a little messy that if user auth is missing we upload the file anyways and then remove it again.
// ... We didn't want to mess with the multer middleware for now though, since it was a pain to get running so smoothly.
// ... Therefore future ToDo: Improve this!
router.post('/', database.upload.single('mediaFile'), async (req, res) => {
    try {
        const oid = String(req.file.id)
        console.log('Successfully uploaded mediaFile to gridFS with ObjectId ' + oid)
        
        // Abort if user unauthorized.
        if (!req.userData) {
            // Revoke the file upload
            database.deleteMediaById(oid, metadata=false)
            console.log('... and removed it again, due to missing user authentication.')
            res.status(401).send('You need to be logged in to upload media files.')
            return
        }

        const metadata = {
            mediaID: oid,
            creatorID: userData._id,
            creatorName: userData.name,
            privacy: req.body.privacy || 'public',
            isTemplate: req.body.isTemplate !== 'false',
            dataType: req.file.contentType
        }

        const newMedia = await database.saveMediaMetadata(metadata)
        console.log('Metadata for new media object: ' + newMedia)

        res.status(201).json({
            message: 'File uploaded successfully',
            mediaID: oid,
            mediaURL: `http://${req.headers.host}/api/media/${oid}`
        })
    } catch (err) {
        console.error('Media file upload failed, due to error:\n'+err)
        res.status(400).send('Media file upload failed, due to error: '+err.message)
    }
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
