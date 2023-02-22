const express = require('express')
const router = express.Router()

// Import our database
const database = require('../database')

// ##########
// # Routes #
// ##########

// Get a list of media, limited by parameters and sorted accordingly.
// TODO: Limiting parameters
// TODO: Sorting
// See also database.js > listMedia()
router.get('/list', async (req, res) => {
    try {
        const memes = await database.listMemes()
        res.status(200).json(memes)
    } catch (err) {
        res.status(500).json({ message: 'Error listing memes: ' + err.message })
    }
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
        console.log('This meme was found:\n' + meme)
        
        // const clientMeme = {
        //     id: meme._id,
        //     src: `http://${req.headers.host}/api/media/${meme.mediaID}`,
        //     title: meme.title,
        //     description: meme.description,
        //     privacy: meme.privacy,
        //     views: meme.viewCount,
        //     score: meme.score,
        //     commentCount: meme.commentCount,
        //     background: {
        //         color: meme.background.color
        //     }
        // }
        // if background.media
        // media: {
        //     src: meme.background.mediaSource
        // },
        res.json(meme) // ToDo: Format again according to client affordances before sending.
    }
})

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
// router.post('/create', (req, res) => {

// })

// Update meme
router.patch('/:id', async (req, res) => {
    try {
        // Parse meme from frontend into database compatible format
        const parsedMeme = parseMeme(req.body, req.headers.host)
        // Save meme
        const updatedMeme = await database.updateMeme(req.params.id, parsedMeme)
        // Return updated meme
        res.status(200).json(updatedMeme)
    }catch (err) {
        console.error(`Failed updating meme ${req.params.id}, due to error:\n${err}`)
        res.status(400).send(err.message)
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
            if (parsedLayer.layerType == 'text') {
                parsedLayer.options = incomingLayer.options
            } else { // layerType is media (i.e. 'image', 'gif', 'video')
                parsedLayer.options.mediaSource = incomingLayer.options.media.src
                parsedLayer.options.fit = incomingLayer.options.fit
                parsedLayer.options.flip = incomingLayer.options.flip
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
        creatorID: '000000000000000000000000', // Placeholder. TODO: Replace with function that fetches user ID from the request. Possible as soon as auth is running.
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
