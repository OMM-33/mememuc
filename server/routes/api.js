// Handling the api routes interacting with the API in general
// Using the express Router library
const express = require('express')
const router = express.Router()

// Get command overview
router.get('/', (req, res) => {
    res.send(`
    Hello World!<br/>
    Please try the following routes:<br/>
    <a href="/api/meme">Memes</a><br/>
    <a href="/api/media">Media</a><br/>
    `)
})

module.exports = router