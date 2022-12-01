import {legacyDb, mongoDb} from "./db.js"
import {ObjectId} from "mongodb"
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
    console.log(`[${request.type} #${++request.number}] Request to login client (login)`);
    
    const preHashPassword = req.body.password
    const loginType = req.body.type

    
    mongoDb.then(connection => {
        if(loginType === "customer")
        {
            // The login request is for a customer
            const email = req.body.email
            // Checks if the customer email exists in the internal database
            console.log(yellowFont, "Checking if customer has an account...")
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
                    // Otherwise, the email entered doesn't exist in the database
                    console.log(redFont, "Customer email does not exist")
                    res.send({"customerExists": false})
                    console.log(greenFont, "Sent response to client\n")
                }
            })
        }
        else
        {
            // The login request is for an employee
            const empID = req.body.empID
            // Checks if the employee exists in the internal database
            console.log(yellowFont, "Checking if employee exists...")
            connection.db("InternalDb").collection("Employees").findOne({"EmpID": empID}).then(employee => {

                if (employee != null){
                    // The employee exists in the database
                    console.log(greenFont, "Employee exists")
    
                    // Hashes the entered password
                    legacyDb.query("SELECT PASSWORD(?) AS password", preHashPassword, (err, encrypted) => {
                        if (err)
                            throw (err)
                        
                        console.log(yellowFont, "Verifying password...")
                        if(employee.Password === encrypted[0].password){
    
                            // Sends data to the client indicating that the login was verified
                            console.log(greenFont, "Employee's ID and password match")
                            res.send({
                                "loginVerified": true,
                                "empName": employee.Name,
                                "empID": empID,
                                "empType": employee.Type
                            })
                            console.log(greenFont, "Sent response to client\n")
                        } else {
    
                            // Sends data to the client indicating that the login was not verified
                            console.log(redFont, "Employee's ID and password do not match")
                            res.send({"loginVerified": false})
                            console.log(greenFont, "Sent response to client\n")
                        }
                    })
                } else {
                    // Otherwise, the ID entered doesn't exist in the database
                    console.log(redFont, "Employee does not exist")
                    res.send({"employeeExists": false})
                    console.log(greenFont, "Sent response to client\n")
                }
            })
        }
        
    })
}


function addToCart (req, res) {
    console.log(`[${request.type} #${++request.number}] Request to add a new product to the customers cart (addToCart)`)

    const email = req.body.email
    const productID = req.body.productID
    const productDesc = req.body.productDesc
    const productWeight = req.body.weight
    const requestedQuantity = req.body.quantity
    const price = req.body.price
    

    // look through DB to find an open order and get that order's _id
    console.log(yellowFont, "Searching for open order...")
    mongoDb.then(connection => {
        connection.db("InternalDb").collection("Orders").findOne({Email: email, OrderStatus: "cart"}).then(openOrder => {
    
            let orderId

            // there is no open order
            if(openOrder == null)
            {
                console.log(redFont, "No open order found")
                console.log(yellowFont, "Creating new open order...")


                // insert the new open order into Orders table
                connection.db("InternalDb").collection("Orders").insertOne({Email: email, OrderStatus: "cart"}).then(queryRes => {
                    if (!queryRes.acknowledged)
                        throw (queryRes)

                    console.log(greenFont, "Open order created")
                    // save the order ID
                    orderId = queryRes.insertedId

                    // insert the new item into Carts table
                    connection.db("InternalDb").collection("Carts").insertOne({Email: email, ProductID: productID, ProductDesc: productDesc, ProductWeight: productWeight, Quantity: requestedQuantity, OrderID: orderId, Price: price}).then(inserted => {
                        if (!inserted.acknowledged)
                            throw (inserted)
                        
                        // Sends data to the client indicating that the product was inserted into the cart
                        console.log(greenFont, "Product inserted into Carts table")
                        res.send({"addedToCart": true, "quantity": requestedQuantity})
                        console.log(greenFont, "Sent response to client\n")
                    })
                })
            }
            else
            {
                console.log(greenFont, "Open order found")

                // save the order ID
                orderId = openOrder._id

                // Checks if the item is already in the cart and tries to update its quantity
                console.log("Checking if the product is already in the customers Carts table...")
                connection.db("InternalDb").collection("Carts").findOneAndUpdate({OrderID: orderId, ProductID: productID}, {$inc: {Quantity: requestedQuantity}}).then(updatedQuantity => {

                    // Only runs if the item wasn't in the cart already
                    if(!updatedQuantity.value){

                        // insert the new item into Carts table
                        connection.db("InternalDb").collection("Carts").insertOne({Email: email, ProductID: productID, ProductDesc: productDesc, ProductWeight: productWeight, Quantity: requestedQuantity, OrderID: orderId, Price: price}).then(inserted => {
                            
                            // Sends data to the client indicating that the product was inserted into the cart
                            console.log(greenFont, "Product inserted into Carts table")
                            res.send({"addedToCart": true, "quantity": requestedQuantity})
                            console.log(greenFont, "Sent response to client\n")
                        })
                    
                    } else {
                        // Sends data to the client indicating that the product was inserted into the cart
                        console.log(greenFont, "Product quantity updated into Carts table")
                        res.send({"addedToCart": true, "quantity": requestedQuantity})
                        console.log(greenFont, "Sent response to client\n")
                    }
                })
            }

        })
    })
}


function updateCart(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to update product quantity in customers cart (updateCart)`)

    const orderID = req.body.OrderID
    const productID = req.body.ProductID
    const newQuantity = req.body.newQuantity

    mongoDb.then(connection => {

        console.log(yellowFont, "Searching for the product in the customers cart...")

        // look through internal DB to update product quantity in the customer's cart
        connection.db("InternalDb").collection("Carts").updateOne({OrderID: ObjectId(orderID), ProductID: productID}, { $set: {Quantity: newQuantity}}).then(updated => {
            
            if (updated.modifiedCount > 0){
                // if the update was successful, send response to client indicating success
                console.log(greenFont, "Updated product quantity in customers cart")
                res.send({"cartItemUpdated": true})
                console.log(greenFont, "Sent response to client\n")

            } else {
                // if the update was not successful, send response to client indicating failure
                console.log(redFont, "Didn't update product quantity in customers cart")
                res.send({"cartItemUpdated": false})
                console.log(greenFont, "Sent response to client\n")
            }
        })
    })
}


function removeFromCart(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to remove product from customers cart (removeFromCart)`)

    const orderID = req.body.OrderID
    const productID = req.body.ProductID
    
    mongoDb.then(connection => {

        console.log(yellowFont, "Searching for the product in the customers cart...")

        // look through internal DB to delete product from the customer's cart
        connection.db("InternalDb").collection("Carts").deleteOne({OrderID: ObjectId(orderID), ProductID: productID}).then(deleted => {
            
            if(deleted.deletedCount > 0){
                // if the removal was successful, send response to client indicating success
                console.log(greenFont, "Removed product from customers cart")
                res.send({"cartItemRemoved": true})
                console.log(greenFont, "Sent response to client\n")

            } else {
                // if the removal was not successful, send response to client indicating failure
                console.log(redFont, "Didn't remove product from customers cart")
                res.send({"cartItemRemoved": false})
                console.log(greenFont, "Sent response to client\n")
            }
        })
    })
}


function updateOrder(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to update the customers order (updateOrder)`)

    const name = req.body.name
    const orderID = req.body.orderID
    const newOrderStatus = req.body.orderStatus
    const itemsTotal = req.body.itemsTotal
    const itemsTotalWeight = req.body.totalWeight
    const shipping = req.body.shipping
    const address = req.body.shippingAddress
    const orderTotal = req.body.orderTotal
    const authorizationNumber = req.body.authorizationNumber
    const timeStamp = req.body.timeStamp
    const productsPurchased = req.body.productsPurchased

    mongoDb.then(connection => {
        
        console.log(yellowFont, "Searching for the customer's open order...")
        
        // look through internal DB to find the customer's open order and update the information
        connection.db("InternalDb").collection("Orders").findOneAndUpdate({_id: ObjectId(orderID)}, {$set: {Name: name, OrderStatus: newOrderStatus, ItemsTotal: itemsTotal, ItemsTotalWeight: itemsTotalWeight, ShippingCharge: shipping, ShippingAddress: address, OrderTotal: orderTotal, AuthorizationNumber: authorizationNumber, TimeStamp: timeStamp}}).then(updatedOrder => {

            // check if the update was successful
            if(updatedOrder.value != null){

                // loop through the entire Products table in internal DB to update the quantities based on what the customer purchased
                productsPurchased.map(product => {
                    connection.db("InternalDb").collection("Products").findOneAndUpdate({ProductID: product.ProductID}, {$inc: {Quantity: -(product.Quantity)}})
                })

                // if the update was successful, send response to client indicating success
                console.log(greenFont, "Updated order status and inserted new data")
                res.send({"updatedOrder": true})
                console.log(greenFont, "Sent response to client\n")

            } else {
                // if the update was not successful, send response to client indicating failure
                console.log(redFont, "Failed to update order status and insert new data")
                res.send({"updatedOrder": false})
                console.log(greenFont, "Sent response to client\n")
            }
            
        })
    })
}


function updateWeightBrackets(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to update the weight brackets (updateWeightBrackets)`)

    const newStartRange = req.body.newWeight
    const newCharge = req.body.newCharge

    // check if either the start range or shipping charge is empty
    // if so, send response to client indicating failure
    if(newStartRange === null || newCharge === null)
        res.send({addedWeightBracket: false})

    mongoDb.then(connection => {

        // look through internal DB to find the weight bracket
        connection.db("InternalDb").collection("WeightBrackets").findOne({StartRange: newStartRange}).then(found => {

            if(found === null){
                // insert the updated weight bracket and shipping charge
                connection.db("InternalDb").collection("WeightBrackets").insertOne({StartRange: newStartRange, Charge: newCharge}).then(added => {
                    // send response to client indicating success
                    res.send({addedWeightBracket: true})
                })
            
            } else {
                // send response to client indicating failure
                res.send({addedWeightBracket: false})
            }
        })
    })
}


function removeWeightBracket(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to remove a weight bracket (removeWeightBracket)`)

    const removeStartRange = parseInt(req.body.removeWeight)
    
    mongoDb.then(connection => {

        // look through internal DB to find and delete the weight bracket
        connection.db("InternalDb").collection("WeightBrackets").deleteOne({StartRange: removeStartRange}).then(deleted => {

            if(deleted.deletedCount != 0){
                // if the removal was successful, send response to client indicating success
                res.send({removedWeightBracket: true})
            
            } else {
                // if the removal was not successful, send response to client indicating failure
                res.send({removedWeightBracket: false})
            }
        })
    })
}


function updateProductQuantity(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to update the quantity of a product (updateProductQuantity)`)
    
    const productID = req.body.productID
    const incQuantity = req.body.incQuantity

    mongoDb.then(connection => {

        // look through internal DB to find the product and update the inventory
        connection.db("InternalDb").collection("Products").findOneAndUpdate({ProductID: productID},  {$inc: {Quantity: incQuantity}}).then(updated => {
            
            if(updated.value != null){
                // if the update was successful, send response to client indicating success
                res.send({"updatedQauntity": true})
            } else {
                // if the update was not successful, send response to client indicating failure
                res.send({"updatedQuantity": false})
            }
        })
    })
}


function shipOrder(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to ship an order (shipOrder)`)

    const orderID = req.body.orderID
    const newOrderStatus = "Shipped"

    mongoDb.then(connection => {

        // look through internal DB to find the order and update the status to "Shipped"
        connection.db("InternalDb").collection("Orders").findOneAndUpdate({_id: ObjectId(orderID)},  {$set: {OrderStatus: newOrderStatus}}).then(updated => {
            
            if(updated.value != null){
                // if the update was successful, send response to client indicating success
                res.send({"shipped": true})
            } else {
                // if the update was not successful, send response to client indicating failure
                res.send({"shipped": false})
            }
        })
    })
}


export {signUpCustomer, loginCustomer, addToCart, updateCart, removeFromCart, updateOrder, updateWeightBrackets, removeWeightBracket, updateProductQuantity, shipOrder}