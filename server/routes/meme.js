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

// Save a meme from our frontend
router.post('/', async (req, res) => {
    const inc = req.body

    let incLayers = []
    for (let i=0; i<inc.layers.length; i++) {
        let layer = inc.layers[i]
        let newLayer = {
            layerType: layer.type,
            origin: {
                x: layer.origin[0],
                y: layer.origin[1]
            },
            rotation: layer.angle,
            scale: {
                x: layer.size[0],
                y: layer.size[1]
            },
            options: {}
        }
        if (newLayer.layerType == 'text') {
            newLayer.options = layer.options
        } else { // layerType is media (i.e. 'image', 'gif', 'video')
            newLayer.options.mediaSource = layer.options.media.src
            newLayer.options.fit = layer.options.fit
            newLayer.options.flip = layer.options.flip
        }
        incLayers.push(newLayer)
    }

    let incBackground = {
        color: inc.background.color
    }
    if(inc.background.media) {incBackground.mediaSource = inc.background.media.src }

    
    try {
        const newMeme = await database.saveMeme(
            mediaID = inc.src.slice(-24), // The last 24 hex chars of the source URL are the ID of the media representation of the meme
            title = inc.title,
            description = inc.description,
            creatorID = '000000000000000000000000', // Placeholder. TODO: Replace with function that fetches user ID from the request. Possible as soon as auth is running.
            updateDate = Date.now(),
            privacy = inc.privacy,
            background = incBackground,
            layers = incLayers
        )
        res.status(201).json(newMeme)
    } catch (err) {
        res.status(400).send(err.message)
    }
    
})

// Create a meme with server-side rendering
// router.post('/create', (req, res) => {

// })

// Update meme
router.put('/:id', (req, res) => {

})

// Delete meme
router.delete('/:id', (req, res) => {

})

module.exports = router
