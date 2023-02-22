const express = require('express')
const router = express.Router()

// Import our database
const database = require('../database')

router.post('/register', async (req, res) => {
    try {
        const { name, password } = req.body
        await database.registerUser(name, password)
        res.status(201).send(`User ${name} created successfully.`)
    } catch (err) {
        res.status(400).send('Failed registering user, due to error: ' + err.message )
    }
})

module.exports = router
