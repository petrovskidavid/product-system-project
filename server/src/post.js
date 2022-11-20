import {legacyDb, mongoDb} from "./db.js"
import {greenFont, yellowFont, redFont} from "./server.js"


/* POST Requests */

const request = {
    type: "POST",
    number: 0
}

// Checks if a customer account can be created and creates one if possible
function signUpCustomer(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to create new customer (signup)`)

    const name = req.body.firstName + " " + req.body.lastName
    const email = req.body.email
    const preHashPassword = req.body.password //< Not encrypted


    mongoDb.then(connection => {
        
        // Checks if the customer already has an account
        connection.db("InternalDb").collection("Customers").findOne({"Email": email}).then(currentCustomer => {

            if (currentCustomer === null){
                
                // Customer doesn't exist, so we first encrypt their password
                console.log(yellowFont, "Encrypting password...")
                legacyDb.query("SELECT PASSWORD(?) AS password", preHashPassword, (err2, encrypted) => {
                    if (err2)
                        throw (err2)
                    

                    // Adds new customer account to the internal database with the encrypted version of their passwsord
                    console.log(yellowFont, "Attempting to insert new customer to internal DB...")
                    connection.db("InternalDb").collection("Customers").insertOne({"_id": email, "Email": email, "Password": encrypted[0].password, "Name": name}).then(queryRes => {
                        if (!queryRes.acknowledged)
                            throw (queryRes)
    

                        console.log(greenFont, "New customer account created")
                        res.send({"addedCustomer": true})
                        console.log(greenFont, "Sent response to client\n")
                    })
                })
            } else {
                // Tells client that the customer already has an account
                console.log(redFont, "Customer already exists")
                res.send({"addedCustomer": false})
                console.log(greenFont, "Sent response to client\n")
            }
        })
    })
}


function loginCustomer(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to login customer (login)`);
    
    const email = req.body.email
    const preHashPassword = req.body.password
    
    // Checks if the customer email exists in the internal database
    console.log(yellowFont, "Checking if customer has an account...")
    mongoDb.then(connection => {
        connection.db("InternalDb").collection("Customers").findOne({"Email": email}).then(customer => {

            if (customer != null){
                // The customer email exists in the database
                console.log(greenFont, "Customer exists")

                // Hashes the entered password
                legacyDb.query("SELECT PASSWORD(?) AS password", preHashPassword, (err2, encrypted) => {
                    if (err2)
                        throw (err2)

                    console.log(yellowFont, "Verifying password...")
                    if(customer.Password === encrypted[0].password){

                        // Sends data to the client indicating that the login was verified
                        console.log(greenFont, "Customer's email and password match")
                        res.send({
                            "loginVerified": true,
                            "customerName": customer.Name,
                            "customerEmail": email
                        })
                        console.log(greenFont, "Sent response to client\n")
                    } else {

                        // Sends data to the client indicating that the login was not verified
                        console.log(redFont, "Customer's email and password do not match")
                        res.send({"loginVerified": false})
                        console.log(greenFont, "Sent response to client\n")
                    }
                })
            } else {
                // Otherwise, the email entered doesn't exists in the database
                console.log(redFont, "Customer email does not exist")
                res.send({"customerExists": false})
                console.log(greenFont, "Sent response to client\n")
            }
        })
    })
}

export {signUpCustomer, loginCustomer}