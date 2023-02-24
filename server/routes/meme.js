const express = require('express')
const router = express.Router()

// Import our database
const database = require('../database')

// ##########
// # Routes #
// ##########

// Get a list of media, limited by parameters and sorted accordingly.
router.get('/list', async (req, res) => {
    const {limit=null, lastId=null, sortBy='updateDate', sortDir=-1, filterBy=null, filterOperator=null, filterValue=null} = req.query
    try {
        // Get userId if userData exists. Otherwise set it to null
        userId = req.userData ? req.userData._id : null
        const memes = await database.listMemes(userId, limit, lastId, sortBy, sortDir, filterBy, filterOperator, filterValue)
        res.status(200).json(memes)
    } catch (err) {
        console.error('Error listing memes:\n' + err)
        res.status(400).send('Error listing memes: ' + err.message)
    }
})

// Get the total count of memes
router.get('/total', async (req, res) => {
    try {
        const totalCount = await database.countMemes()
        res.status(200).json({
            totalMemes: totalCount
        })
    } catch (err) {
        console.error(err)
        res.status(500).send('Failed getting total count of memes: ' + err.message)
    }
})

// Get a random meme
router.get('/random', async (req, res) => {
    // Get the Id of a random meme from the database
    const randomMemeId = await database.getRandomMemeId()
    // Redirect towards the GET path for this meme. 
    // Theoretically we could also straight up send the meme, but found it better for system resilience if memes are always fetched the same way.
    res.redirect(`${randomMemeId}?jwt=${req.query.jwt}`);
})

// Get the meme with the specified id (if it exists)
// TODO: Auth (privacy || isAdmin || isCreator)
router.get('/:id', async (req, res) => {
    console.log('Getting meme with id: ' + req.params.id) // Debugging
    let meme
    try {
        meme = await database.getMemeById(req.params.id, res)
    } catch (err) {
        console.error('Failed retrieving meme from database, due to:\n' + err)
        res.status(500).send('Internal Server Error: ' + err.message)
    }
    if (!meme) {
        // No meme with this id was found
        res.status(404).send('Meme Not Found')
    } else {
        // Meme successfully found. Return it for further handling.
        // console.log('This meme was found:\n' + meme)
        res.json(meme)
    }
})

// Get the meme after this one according to the specified query params
router.get('/:id/next', async (req, res) => {
    await adjacentMeme(req, res, '$lt')
})

// Get the meme before this one according to the specified query params
router.get('/:id/previous', async (req, res) => {
    await adjacentMeme(req, res, '$gt')
})

// Actual implementation of the above
// ToDO Auth!
async function adjacentMeme(req, res, direction) {
    const sortBy = req.query.sortBy || 'updateDate' // Either sort by the field specified in query params or per default by updateDate (which is equal to publish date since published memes can no longer be updated)
    try {
        const result = await database.getAdjacentMemeId(req.params.id, sortBy, direction)
        if(!result) { // No adjacent meme in this direction was found. The current meme seems to be the last in the chain of these values.
            console.log(`There are no further memes for ${sortBy} ${direction} ${req.params.id}`)
            res.status(404).send('No further memes in this direction.')
        } else {
            const {_id: adjacentMemeId} = result
            console.log(`Found the meme for ${sortBy} ${direction} ${req.params.id}: ${adjacentMemeId}`)
            res.redirect(`../${adjacentMemeId}?jwt=${req.query.jwt}`);
        }
    } catch (err) {
        console.error(`Could not provide adjacent meme for ${req.params.id}, due to error:\n${err}`)
        res.status(400).send(`Could not provide adjacent meme for ${req.params.id}, due to error: ${err.message}`)
    }
}

// Get command overview
router.get('/', (req, res) => {
    res.send('Hello World!')
    // ToDo
})

// Save a meme from our frontend (after parsing it)
router.post('/', async (req, res) => {
    try {
        // Parse meme from frontend into database compatible format
        const parsedMeme = parseMeme(req.body, req.headers.host)
        // Save meme
        const newMeme = await database.saveMeme(parsedMeme)
        // Return saved meme
        res.status(201).json(newMeme)
    } catch (err) {
        console.error('Failed saving new meme, due to error:\n' + err)
        res.status(400).send(err.message)
    }

})

// Create a meme with server-side rendering
// router.post('/create', (req, res) => {})

// Update meme
router.patch('/:id', async (req, res) => {
    try {
        // Parse meme from frontend into database compatible format
        const parsedMeme = parseMeme(req.body, req.headers.host)
        // Before updating save the Id of the old media representation of the meme
        const oldMediaId = await database.getMediaIdOfMemeId(req.params.id)
        // Save meme
        const updatedMeme = await database.updateMeme(req.params.id, parsedMeme)
        // After updating, delete the old media representation of the meme
        try { // Separate try catch, as updating still succeeded and media deletion fail is not that critical.
            await database.deleteMediaById(oldMediaId)
            // Return updated meme
            res.status(200).json(updatedMeme)
        } catch (err) {
            console.error(`Error deleting old media ${oldMediaId} for meme ${req.params.id}:\n${err}`)
            res.status(500).json({
                message: `Meme successfully updated. However: Error deleting old media ${oldMediaId} for meme ${req.params.id}: ${err.message}`,
                updatedMeme: updatedMeme
            })
        }
    }catch (err) {
        console.error(`Error updating meme ${req.params.id}:\n${err}`)
        res.status(400).send('Error updating meme: ' + err.message)
    }
})

// Delete meme
router.delete('/:id', (req, res) => {

})

// ####################
// # Helper functions #
// ####################

// Parses the client side representation of a meme into one the database can handle
function parseMeme(incoming, host) {
    let parsedLayers = []
    if(incoming.layers){
        for (let i=0; i<incoming.layers.length; i++) {
            let incomingLayer = incoming.layers[i]
            let parsedLayer = {
                layerType: incomingLayer.type,
                origin: {
                    x: incomingLayer.origin[0],
                    y: incomingLayer.origin[1]
                },
                rotation: incomingLayer.angle,
                scale: {
                    x: incomingLayer.size[0],
                    y: incomingLayer.size[1]
                },
                options: {}
            }
            if (parsedLayer.layerType === 'text') {
                parsedLayer.options = incomingLayer.options
            } else { // layerType is media (i.e. 'image', 'gif', 'video')
                parsedLayer.options = {
                    ...incomingLayer.options,
                    mediaSource: incomingLayer.options.media.src,
                };
                delete parsedLayer.options.media;
            }
            parsedLayers.push(parsedLayer)
        }
    }

    let parsedBackground = {
        color: incoming.background.color
    }
    if(incoming.background.media) {
        parsedBackground.mediaSource = incoming.background.media.src
    }

    let parsedDescription
    if(incoming.description) {
       parsedDescription = incoming.description
    }

    const parsedMediaID = incoming.src.slice(-24) // The last 24 hex chars of the source URL are the ID of the media representation of the meme

    const parsedMeme = {
        mediaID: parsedMediaID,
        mediaURL: `http://${host}/api/media/${parsedMediaID}`,
        title: incoming.title,
        description: parsedDescription,
        creatorID: '63f81f078f07af6524bb9f0e', // Placeholder. TODO: Replace with function that fetches user ID from the request. Possible as soon as auth is running.
        updateDate: Date.now(),
        privacy: incoming.privacy,
        background: parsedBackground,
        layers: parsedLayers
    }

    return parsedMeme
}

// ###########
// # Exports #
// ###########

module.exports = router
