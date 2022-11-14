import express from "express" 
import cors from "cors"
import {internalDb, legacyDb} from "./db.js"

// Initializes express server
const server = express()
const port = 8800

server.use(cors())

server.listen(port, () => {
    console.log(`Server is online!\nListening to port ${port}`)
});

server.get("/api/getProducts", (req, res) => {
    console.log("Recieved GET for getProducts")

    legacyDb.query("SELECT * FROM parts", (err, rows) => {
        if (err)
            throw err

        res.send(rows)
        console.log("Sent response")
    })
})

export default server