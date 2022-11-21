import express from "express" 
import cors from "cors"
import {getProducts} from "./get.js"
import {signUpCustomer, loginCustomer} from "./post.js"


// Initializes express server
const server = express()
const PORT = 8800
const greenFont = "\x1b[32m%s\x1b[0m"
const yellowFont = "\x1b[33m%s\x1b[0m"
const redFont = "\x1b[31m%s\x1b[0m"

server.use(cors())
server.use(express.json())

// Tells server to listen to the specified port
server.listen(PORT, () => {
    console.clear()
    console.log(greenFont, "Server is online!")
    console.log(`Listening to port ${PORT}\n`)
});


/* GET Requests */

// API request to retrieve all products withing the database
server.get("/api/getProducts", getProducts)


/* POST Requests */

// API request to add a customer to the internal database
server.post("/api/signup", signUpCustomer)

// API request to check customer login info in order to approve login request
server.post("/api/login", loginCustomer)


export {greenFont, yellowFont, redFont}