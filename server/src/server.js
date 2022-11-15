import express from "express" 
import cors from "cors"
import {internalDb, legacyDb} from "./db.js"


// Initializes express server
const server = express()
const PORT = 8800
server.use(cors())
server.use(express.json())

let requestNum = 0 //< Keeps track of the request number

// Tells server to listen to the specified port
server.listen(PORT, () => {
    console.log("\x1b[32m%s\x1b[0m", "Server is online!")
    console.log(`Listening to port ${PORT}\n`)
});


/* GET Requests */

// API request to retrieve all products withing the database
server.get("/api/getProducts", (req, res) => {
    console.log(`(${++requestNum}) Recieved GET request for getProducts`)

    // Retrieve all products from legacy database
    console.log('\x1b[33m%s\x1b[0m', "Retriving legacy DB data...")
    legacyDb.query("SELECT * FROM parts", (err, legacyRows) => {
        if (err)
            throw err

        /* 
            Loops through all the products from the legacy database, checks if they are in internal database
            and if not it inserts them with a default quantity in the Product table
        */
        for(let i = 0; i < legacyRows.length; i++) {
            
            // Only runs if the given ProductID is not in the Products table
            internalDb.query("INSERT IGNORE INTO Products VALUES (?, ?)", [legacyRows[i].number, Math.floor(Math.random() * 100)], (err, internalRows) => {
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
            console.log("\x1b[32m%s\x1b[0m", "Sent response to client\n")
        })
    })
})


/* POST Requests */

// API request to add a customer to the internal database
server.post("/api/signup", (req, res) => {
    console.log(`(${++requestNum}) Recieved POST request for signup`)

    
    const name = req.body.firstName + " " + req.body.lastName
    const email = req.body.email
    const password = req.body.password

    // Inserts new customer to Customer table if it doesn't exist, otherwise it ignores
    console.log('\x1b[33m%s\x1b[0m', "Attempting to insert new customer to internal DB...")
    internalDb.query("INSERT IGNORE INTO Customers VALUES (?, ?, ?)", [email, password, name], (err, rows) => {
        if (err)
            throw err

        if (rows.affectedRows === 0) {
            console.log('\x1b[41m%s\x1b[0m', "Customer already exists")
        }

        res.send(rows)
        console.log("\x1b[32m%s\x1b[0m", "Sent response to client\n")
    })
})