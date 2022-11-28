import express from "express" 
import cors from "cors"
import {getProducts, getCart, getWeightBrackets} from "./get.js"
import {signUpCustomer, loginCustomer, addToCart, updateCart, removeFromCart, updateOrder} from "./post.js"


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

// API request to retrieve all products withing a customers cart
server.get("/api/getCart", getCart)

// API request to retrieve all weight brackets
server.get("/api/getWeightBrackets", getWeightBrackets)


/* POST Requests */

// API request to add a customer to the internal database
server.post("/api/signup", signUpCustomer)

// API request to check customer login info in order to approve login request
server.post("/api/login", loginCustomer)

// API request to add a certain quantity of a product to a customers cart
server.post("/api/addToCart", addToCart)

// API request to update the quantity of a product in a customers cart
server.post("/api/updateCart", updateCart)

// API request to remove of a product in a customers cart
server.post("/api/removeFromCart", removeFromCart)

// API request to update a customers order
server.post("/api/updateOrder", updateOrder)


export {greenFont, yellowFont, redFont}