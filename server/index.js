// Dotenv makes use of a .env file to store environment specific and potentially sensitive information.
// After import environment variables from dotenv can be imported via the syntax: process.env.VARIABLE_NAME
require("dotenv").config()

// Express framework for routing and middleware https://expressjs.com/
const express = require("express")
// cors is a middleware that can be used to enable CORS with various options. https://www.npmjs.com/package/cors
const cors = require("cors")
// Import jsonwebtoken, which we will use for the client to prove its identity to the server.
const jwt = require('jsonwebtoken')

//Initialize Express
const app = express()

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Middleware to be executed before routing %
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Middleware describes code that runs "in the middle" between every request to and response from the server.

// Enable All CORS Requests (ref: https://expressjs.com/en/resources/middleware/cors.html)
app.use(cors())

// This lets our server accept JSON as the element of a request body.
app.use(express.json())

// Parses the JWT that is being sent by the query params and puts the userData in the request.
// Future ToDo: Send / Accept JWT in authorization header instead.
app.use((req, res, next) => {
	try {
        // Fetch the submitted token from query params
		const token = req.query.jwt
        // Verify and decode token to userData
        req.userData = jwt.verify(token, process.env.JWT_SECRET_KEY)
		console.log(`Successfully authenticated user "${req.userData.name}"`)
		next()

	} catch (err) {
        // This line can be used instead of next() if you want to stop processing requests, that fail authentication here.
        // Since we want our system fully available for non-registered users to, it is commented out.
        // Limitations are handled by checking what each user is allowed to do.
		// return res.status(401).send('Authentication failed')

        console.log('User authentication failed. Continuing unauthenticated. Error: ' + err)
        // After we logged the error we set the jwt query parameter to empty to prevent null pointer errors when adding it to referral requests.
        if(!req.query.jwt){ req.query.jwt='' }
        next()
	}
})

// %%%%%%%%%%%
// % Routing %
// %%%%%%%%%%%

// Route to return the upload.html file, that allows us to test the file upload to the server.
app.get("/uploadtest", function (req, res) {
	res.sendFile(__dirname + "/testing/upload.html")
})

// In order to keep this tidy we keep all of our API routes in separate files.
const memeRoutes = require("./routes/meme")
const mediaRoutes = require("./routes/media")
const userRoutes = require("./routes/user")
const apiRoutes = require("./routes/api")
// Importing it like this will resolve all routes to /api or deeper through the aforementioned file.
app.use("/api/meme", memeRoutes)
app.use("/api/media", mediaRoutes)
app.use("/api/user", userRoutes)
app.use("/api", apiRoutes)

// If none of the above routes fit, send a 404
app.use(function (req, res) {
	res.status(404).send("Route Not Found")
})

// %%%%%%%%%%%%%%%%
// % Start Server %
// %%%%%%%%%%%%%%%%
if (!process.env.SERVER_PORT) {
	process.env.SERVER_PORT = 3000
	console.warn(
		"No environment variable SERVER_PORT specified in .env file. Please add your preferred port for this api server to file ./.env. Launching with default port " +
			process.env.SERVER_PORT
	)
}
app.listen(process.env.SERVER_PORT, () =>
	console.log("Server started at port: " + process.env.SERVER_PORT)
)
