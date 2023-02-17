const express = require('express')
const router = express.Router()

// Get command overview
router.get('/', (req, res) => {
    res.send('Hello World!')
})

// Get one meme
router.get('/:id', (req, res) => {

})

// Create meme(s)
router.post('/', (req, res) => {

})

// Update meme
router.put('/:id', (req, res) => {

})

// Delete meme
router.delete('/:id', (req, res) => {

})

module.exports = router