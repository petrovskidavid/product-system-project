import express from "express" 
import cors from "cors"
import {internalDb, legacyDb} from "./db.js"


// Initializes express server
const server = express()
const PORT = 8800
server.use(cors())


// Tells server to listen to the specified port
server.listen(PORT, () => {
    console.log("\x1b[32m%s\x1b[0m", "Server is online!")
    console.log(`Listening to port ${PORT}\n`)
});


// API call to retrieve all products withing the database
server.get("/api/getProducts", (req, res) => {
    console.log("Recieved GET for getProducts")

    // Retrieve all products from legacy database
    legacyDb.query("SELECT * FROM parts", (err, legacyRows) => {
        if (err)
            throw err
        
        // Initiate internal database with default quantity values if possible
        console.log('\x1b[33m%s\x1b[0m', "Retriving legacy DB data...")
        for(let i = 0; i < legacyRows.length; i++) {
            internalDb.query("INSERT IGNORE INTO Products VALUES (?, ?)", [legacyRows[i].number, 20], (err, internalRows) => {
                if (err)
                    throw err

            })
        }

        const productsList = [] //< Stores all the data for the products

        // Gets all the products and quantities from internal databse
        console.log('\x1b[33m%s\x1b[0m', "Retriving internal DB data...")
        internalDb.query("SELECT * FROM Products", (err, internalRows) => {
            if (err)
                throw err
            
            // Combines legact database data with the corresponding internal database data
            console.log("Combining data...")
            for (let i = 0; i < legacyRows.length; i++) {
                productsList.push({...legacyRows[i], ...internalRows[i]})
            }

            // Sends the data to the client
            res.send(productsList)
            console.log("\x1b[32m%s\x1b[0m", "Sent response\n")
        })
    })
})