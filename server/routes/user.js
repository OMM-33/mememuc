const express = require('express')
const router = express.Router()

// Import our database
const database = require('../database')
// Import jsonwebtoken, which we will use for the client to prove its identity to the server.
const jwt = require('jsonwebtoken')
// ToDo: Use a library like bcrypt to hash and salt passwords when storing them. HTTPS would also be nice.

// Submit a unique username and password and it will successfully register you in the database.
router.post('/register', async (req, res) => {
	try {
		const { name, password } = req.body
		await database.registerUser(name, password)
		res.status(201).send(`User ${name} created successfully.`)
	} catch (err) {
		res
			.status(400)
			.send('Failed registering user, due to error: ' + err.message)
	}
})

// Submit your username and password that you have registered before and you'll receive a JWT that allows you to securely identify you to the server.
router.post('/login', async (req, res) => {
	try {
        // Get user and password from the request
		const {name, password} = req.body
        // Check if there is a user with that name registered
		const user = await database.getUser(name)
		if (!user) {
            console.log(`User ${name} not found. Authentication failed.`)
            return res.status(401).send('Authentication failed') // For the client we don't want to specify whether user or password were wrong.
        }
        
		// Check if the passwords match, otherwise abort. ToDo: Upon bcrypt integration we would need to user bcrypt.compare() here.
		if (user.password !== password) {
            console.log(`Password for ${name} was wrong. Authentication failed.`)
            return res.status(401).send('Authentication failed') // For the client we don't want to specify whether user or password were wrong.
        }

		const token = jwt.sign({userId: user._id}, 'secret-key') // ToDo: In the future this should expire, by handing it an options object, like { expiresIn: '12h' }.
		res.status(200).json({token})
	} catch (err) {
        console.error(`User authentication failed, due to error:\n${err}`)
		res.status(500).json({error: err.message})
	}
})

module.exports = router
