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
    const password = req.body.password //< Not encrypted

    // Checks if the customer already has an account
    console.log('\x1b[33m%s\x1b[0m', "Checking if customer already has an account...")
    internalDb.query("SELECT Email FROM Customers WHERE Email=?", email, (err1, currentCustomer) => {
        if (err1)
            return err1


        if (currentCustomer.length > 0){
            console.log('\x1b[31m%s\x1b[0m', "Customer already exists")

            // Tells client that the customer already has an account
            res.send({"addedCustomer": false})
            console.log("\x1b[32m%s\x1b[0m", "Sent response to client\n")

        } else {

            // Otherwise, encryptes the provided password
            console.log('\x1b[33m%s\x1b[0m', "Encrypting password...")
            internalDb.query("SELECT PASSWORD(?) AS password", password, (err2, encrypted) => {
                if (err2)
                    throw (err2)


                // Adds new customer account to the internal database with the encrypted version of their passwsord
                console.log('\x1b[33m%s\x1b[0m', "Attempting to insert new customer to internal DB...")
                internalDb.query("INSERT INTO Customers VALUES (?, ?, ?)", [email, encrypted[0].password, name], (err3, newCustomer) => {
                    if (err3)
                        throw err3


                    // Tells the client that the customers account was created
                    console.log("\x1b[32m%s\x1b[0m", "New customer account created")
                    res.send({"addedCustomer": true})
                    console.log("\x1b[32m%s\x1b[0m", "Sent response to client\n")
                })
            })
        }
    })
})


// API request to check customer login info in order to approve login request
server.post("/api/login", (req, res) => {
    console.log(`(${++requestNum}) Recieved POST request for login`);
    
    const email = req.body.email
    const preHashPassword = req.body.password
    
    console.log('\x1b[33m%s\x1b[0m', "Checking if customer has an account...")

    // Checks if the customer email exists in the internal database
    internalDb.query("SELECT Email FROM Customers WHERE Email=?", email, (err1, currentCustomer) => {
        if (err1)
            return err1

        if (currentCustomer.length > 0)
        {
            console.log('\x1b[31m%s\x1b[0m', "Customer exists")
            console.log('\x1b[33m%s\x1b[0m', "Verifying password...")

            // Hash the entered password
            internalDb.query("SELECT PASSWORD(?) AS password", preHashPassword, (err2, postHash) => {
                if (err2)
                    throw (err2)

                // Retrieves the hashed password from the interanl database
                internalDb.query("SELECT Password as password FROM Customers", (err3, hashed) => {
                    if (err3)
                        throw (err3)

                    // Checks if the hashed password from the internal database matches the hashed entered password
                    if (hashed[0].password == postHash[0].password)
                    {
                        // Sends data to the client indicating that the login was verified
                        console.log('\x1b[31m%s\x1b[0m', "Customer's email and password match")
                        res.send({"loginVerified": true})
                    }
                    else
                    {
                        // Sends data to the client indicating that the login was not verified
                        console.log('\x1b[31m%s\x1b[0m', "Customer's email and password do not match")
                        res.send({"loginVerified": false})
                    }

                })
            })
        }
        else
        {
            // Sends data to the client indicating that the email was not found in the internal database
            console.log('\x1b[31m%s\x1b[0m', "Customer email does not exist")
            res.send({"customerExists": false})
        }
    })

})