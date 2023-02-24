const express = require('express')
const router = express.Router()

// Import our database
const database = require('../database')

// ##########
// # Routes #
// ##########

// Get a list of media, limited by parameters and sorted accordingly.
router.get('/list', async (req, res) => {
    try {
        // Get possible query parameters to adapt this search or use defaults
        const {limit=null, lastId=null, sortBy='updateDate', sortDir=-1, filterBy=null, filterOperator=null, filterValue=null, published=false} = req.query
        // Get userId if userData exists. Otherwise set it to null
        const userId = req.userData ? req.userData._id : null

        const memes = await database.listMemes(userId, limit, lastId, sortBy, sortDir, filterBy, filterOperator, filterValue, published)
        res.status(200).json(memes)
    } catch (err) {
        console.error('Error listing memes:\n' + err)
        res.status(400).send('Error listing memes: ' + err.message)
    }
})

// Get the total count of memes
router.get('/total', async (req, res) => {
    try {
        // Get userId if userData exists. Otherwise set it to null
        const userId = req.userData ? req.userData._id : null
        const totalCount = await database.countMemes(userId)
        res.status(200).json({
            totalMemes: totalCount
        })
    } catch (err) {
        console.error(err)
        res.status(500).send('Failed getting total count of memes: ' + err.message)
    }
})

// Get a random meme you are allowed to see
router.get('/random', async (req, res) => {
    try{
        // Get possible query parameters to adapt this search or use defaults
        const {filterBy=null, filterOperator=null, filterValue=null} = req.query
        // Get userId if userData exists. Otherwise set it to null
        const userId = req.userData ? req.userData._id : null

        // Get all possible memes for this user
        const memes = await database.listMemes(userId, filterBy, filterOperator, filterValue)

        // Pick a random meme id out of the possible ones
        const randomMemeId = memes[getRandomInt(memes.length)]._id
        
        // Redirect towards the GET path for this meme. 
        // Theoretically we could also straight up send the meme, but found it better for system resilience if memes are always fetched the same way. (Because of stats etc.)
        res.redirect(`${randomMemeId}?jwt=${req.query.jwt}`)

    } catch (err) {
        console.error('Error getting random meme:\n'+err)
        res.status(500).send('Error getting random meme: '+err.message)
    }
})

// Get the meme with the specified id (if it exists)
router.get('/:id', async (req, res) => {
    try {
        console.log('Getting meme with id: ' + req.params.id) // Debugging
        
        // Get userId if userData exists. Otherwise set it to null
        const userId = req.userData ? req.userData._id : null

        const meme = await database.getMemeById(req.params.id, userId)
        
        if (!meme) {
            // No meme with this id was found
            res.status(404).send('Meme Not Found')
        } else {
            // Meme successfully found. Return it for further handling.
            // console.log('This meme was found:\n' + meme)
            res.json(meme)
        }
    } catch (err) {
        console.error('Failed retrieving meme from database, due to:\n' + err)
        res.status(500).send('Internal Server Error: ' + err.message)
    }
})

// Get the meme after this one according to the specified query params
router.get('/:id/next', async (req, res) => {
    await adjacentMeme(req, res, 1)
})

// Get the meme before this one according to the specified query params
router.get('/:id/previous', async (req, res) => {
    await adjacentMeme(req, res, -1)
})

// Actual implementation of the above
// Future ToDo: There should be a more efficient implementation without fetching the entire list of memes.
async function adjacentMeme(req, res, direction) {
    try {
        // Get possible query parameters to adapt this search or use defaults
        const {limit=null, lastId=null, sortBy='updateDate', filterBy=null, filterOperator=null, filterValue=null} = req.query
        // SortDir is received separately as it is also influenced by direction
        const sortDir = (req.query.sortDir || -1) * direction
        // Get userId if userData exists. Otherwise set it to null
        const userId = req.userData ? req.userData._id : null
        
        // Get all possible memes for this user with the specified parameters
        const memes = await database.listMemes(userId, limit, lastId, sortBy, sortDir, filterBy, filterOperator, filterValue)

        // Find the index of the current meme in the array
        // Find the index of the meme with the specified _id
        const currentMemeIndex = memes.findIndex(meme => meme._id.toString() === req.params.id)
        
        // Return a redirect of the next / previous meme in the array if it exists. 404 otherwise
        const adjacentMemeIndex = currentMemeIndex + 1 // Always +1 as decision if next / previous was already accounted for above
        if(adjacentMemeIndex >= memes.length) {
            // No adjacent meme in this direction exists for this user. The current meme seems to be the last in the chain for these parameters.
            console.log(`There are no further memes for ${sortBy} ${direction} of ${req.params.id}`)
            res.status(404).send('No further memes in this direction.')
        } else {
            const adjacentMemeId = memes[adjacentMemeIndex]._id
            console.log(`Found the meme for ${sortBy} ${direction} of ${req.params.id}: ${adjacentMemeId}`)
            res.redirect(`../${adjacentMemeId}?jwt=${req.query.jwt}`);
        }
    } catch (err) {
        console.error(`Could not provide adjacent meme for ${req.params.id}, due to error:\n${err}`)
        res.status(400).send(`Could not provide adjacent meme for ${req.params.id}, due to error: ${err.message}`)
    }
}

// // Get command overview
// router.get('/', (req, res) => {
//     res.send('Hello World!')
//     // ToDo
// })

// Save a meme from our frontend (after parsing it)
router.post('/', async (req, res) => {
    // Abort if user unauthorized.
    if (!req.userData) {
        res.status(401).send('You need to be logged in to publish your memes.')
        return
    }
    try {
        // Parse meme from frontend into database compatible format
        const parsedMeme = parseMeme(req.userData, req.body, req.headers.host)
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
    // Abort if user unauthorized.
    if (!req.userData) {
        res.status(401).send('You need to be logged in to comment.')
        return
    }
    try {
        // Parse meme from frontend into database compatible format
        const parsedMeme = parseMeme(req.userData, req.body, req.headers.host)
        // Before updating save the Id of the old media representation of the meme
        // Seems to sometimes not find the old media correctly // ToDo: fix (non-critical)
        const oldMediaId = await database.getMediaIdOfMemeId(req.params.id)
        // Save meme
        const updatedMeme = await database.updateMeme(req.userData, req.params.id, parsedMeme)
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

// Posts a comment to the meme of the Id.
router.post('/:id/comment', async (req, res) => {
    // Abort if user unauthorized.
    if (!req.userData) {
        res.status(401).send('You need to be logged in to comment.')
        return
    }
    try {
        const {_id, name} = req.userData
        const commentedMeme = await database.postComment(req.params.id, _id, name, req.body.content)
        res.status(201).json(commentedMeme)
    } catch (err) {
        console.error('Commenting failed:\n' + err)
        res.status(400).send('Commenting failed: ' + err.message)
    }
})

// Casts a vote to the meme of the Id.
router.post('/:id/vote', async (req, res) => {
    // Abort if user unauthorized.
    if (!req.userData) {
        res.status(401).send('You need to be logged in to vote.')
        return
    }
    try {
        const {_id, name} = req.userData
        const votedMeme = await database.castVote(req.params.id, _id, name, req.body.value)
        res.status(200).json(votedMeme)
    } catch (err) {
        console.error('Voting failed:\n' + err)
        res.status(400).send('Voting failed: ' + err.message)
    }
})

// Delete meme (Future ToDo)
// router.delete('/:id', (req, res) => {})

// ####################
// # Helper functions #
// ####################

// Parses the client side representation of a meme into one the database can handle
function parseMeme(userData, incoming, host) {
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
        creatorID: userData._id,
        creatorName: userData.name,
        updateDate: Date.now(),
        privacy: incoming.privacy,
        background: parsedBackground,
        layers: parsedLayers
    }

    return parsedMeme
}

// Get a random integer value out of max possible ones (e.g. max=3 returns 0 or 1 or 2)
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// ###########
// # Exports #
// ###########

module.exports = router
