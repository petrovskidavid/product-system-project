import express from "express" 
import {internalDb, legacyDb} from "./db.js"

// Initializes express server
const server = express()
const port = 8800

server.listen(port, () => {
    console.log(`Server is online!\nListening to port ${port}`)
});

server.post("/api/addProduct", (req, res) => {

})

export default server