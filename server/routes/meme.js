const express = require('express')
const router = express.Router()

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

// Get one meme
router.get('/:id', (req, res) => {
    // ToDo
})

// Get command overview
router.get('/', (req, res) => {
    res.send('Hello World!')
    // ToDo
})

// Save a meme
router.post('/', (req, res) => {
    const inc = req.body
    // TODO: Cont Here
    // database.saveMeme(mediaID, title, description, creatorID, updateDate, privacy, background, layers)
})

// Create a meme with server-side rendering
router.post('/create', (req, res) => {

})

// Update meme
router.put('/:id', (req, res) => {

})

// Delete meme
router.delete('/:id', (req, res) => {

})

module.exports = router