import {legacyDb, mongoDb} from "./db.js"
import {ObjectId} from "mongodb"
import {greenFont, yellowFont, redFont} from "./server.js"


/* POST Requests */

const request = {
    type: "POST",
    number: 0
}


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
                legacyDb.query("SELECT PASSWORD(?) AS password", preHashPassword, (err2, encrypted) => {
                    if (err2)
                        throw (err2)
                    

                    // Adds new customer account to the internal database with the encrypted version of their passwsord
                    connection.db("InternalDb").collection("Customers").insertOne({"_id": email, "Email": email, "Password": encrypted[0].password, "Name": name}).then(queryRes => {

                        console.log(greenFont, "New customer account created\n")
                        res.send({"addedCustomer": true})
                    })
                })
            } else {
                // Tells client that the customer already has an account
                console.log(redFont, "Customer already exists\n")
                res.send({"addedCustomer": false})
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
                            console.log(greenFont, "Customer's email and password match\n")
                            res.send({
                                "loginVerified": true,
                                "customerName": customer.Name,
                                "customerEmail": email
                            })
                        } else {
    
                            // Sends data to the client indicating that the login was not verified
                            console.log(redFont, "Customer's email and password do not match\n")
                            res.send({"loginVerified": false})
                        }
                    })
                } else {
                    // Otherwise, the email entered doesn't exist in the database
                    console.log(redFont, "Customer email does not exist\n")
                    res.send({"customerExists": false})
                }
            })
        }
        else
        {
            // The login request is for an employee
            const empID = req.body.empID
            // Checks if the employee exists in the internal database
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
                            console.log(greenFont, "Employee's ID and password match\n")
                            res.send({
                                "loginVerified": true,
                                "empName": employee.Name,
                                "empID": empID,
                                "empType": employee.Type
                            })
                        } else {
    
                            // Sends data to the client indicating that the login was not verified
                            console.log(redFont, "Employee's ID and password do not match\n")
                            res.send({"loginVerified": false})
                        }
                    })
                } else {
                    // Otherwise, the ID entered doesn't exist in the database
                    console.log(redFont, "Employee does not exist\n")
                    res.send({"employeeExists": false})
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
    mongoDb.then(connection => {
        connection.db("InternalDb").collection("Orders").findOne({Email: email, OrderStatus: "cart"}).then(openOrder => {
    
            let orderId

            // there is no open order
            if(openOrder == null)
            {
                console.log(redFont, "No open order found")

                // insert the new open order into Orders table
                connection.db("InternalDb").collection("Orders").insertOne({Email: email, OrderStatus: "cart"}).then(queryRes => {
                    if (!queryRes.acknowledged)
                        throw (queryRes)

                    console.log("Open order created")
                    // save the order ID
                    orderId = queryRes.insertedId

                    // insert the new item into Carts table
                    connection.db("InternalDb").collection("Carts").insertOne({Email: email, ProductID: productID, ProductDesc: productDesc, ProductWeight: productWeight, Quantity: requestedQuantity, OrderID: orderId, Price: price}).then(inserted => {
                        if (!inserted.acknowledged)
                            throw (inserted)
                        
                        // Sends data to the client indicating that the product was inserted into the cart
                        console.log(greenFont, "Product inserted into Carts table\n")
                        res.send({"addedToCart": true, "quantity": requestedQuantity})
                    })
                })
            }
            else
            {
                console.log("Open order found")

                // save the order ID
                orderId = openOrder._id

                // Checks if the item is already in the cart and tries to update its quantity
                connection.db("InternalDb").collection("Carts").findOneAndUpdate({OrderID: orderId, ProductID: productID}, {$inc: {Quantity: requestedQuantity}}).then(updatedQuantity => {

                    // Only runs if the item wasn't in the cart already
                    if(!updatedQuantity.value){

                        // insert the new item into Carts table
                        connection.db("InternalDb").collection("Carts").insertOne({Email: email, ProductID: productID, ProductDesc: productDesc, ProductWeight: productWeight, Quantity: requestedQuantity, OrderID: orderId, Price: price}).then(inserted => {
                            
                            // Sends data to the client indicating that the product was inserted into the cart
                            console.log(greenFont, "Product inserted into Carts table\n")
                            res.send({"addedToCart": true, "quantity": requestedQuantity})
                        })
                    
                    } else {
                        // Sends data to the client indicating that the product was inserted into the cart
                        console.log(greenFont, "Product quantity updated into Carts table\n")
                        res.send({"addedToCart": true, "quantity": requestedQuantity})
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

        // look through internal DB to update product quantity in the customer's cart
        connection.db("InternalDb").collection("Carts").updateOne({OrderID: ObjectId(orderID), ProductID: productID}, { $set: {Quantity: newQuantity}}).then(updated => {
            
            if (updated.modifiedCount > 0){
                // if the update was successful, send response to client indicating success
                console.log(greenFont, "Updated product quantity in customers cart\n")
                res.send({"cartItemUpdated": true})

            } else {
                // if the update was not successful, send response to client indicating failure
                console.log(redFont, "Didn't update product quantity in customers cart\n")
                res.send({"cartItemUpdated": false})
            }
        })
    })
}


function removeFromCart(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to remove product from customers cart (removeFromCart)`)

    const orderID = req.body.OrderID
    const productID = req.body.ProductID
    
    mongoDb.then(connection => {

        // look through internal DB to delete product from the customer's cart
        connection.db("InternalDb").collection("Carts").deleteOne({OrderID: ObjectId(orderID), ProductID: productID}).then(deleted => {
            
            if(deleted.deletedCount > 0){
                // if the removal was successful, send response to client indicating success
                console.log(greenFont, "Removed product from customers cart\n")
                res.send({"cartItemRemoved": true})

            } else {
                // if the removal was not successful, send response to client indicating failure
                console.log(redFont, "Didn't remove product from customers cart\n")
                res.send({"cartItemRemoved": false})
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
        
        
        // look through internal DB to find the customer's open order and update the information
        connection.db("InternalDb").collection("Orders").findOneAndUpdate({_id: ObjectId(orderID)}, {$set: {Name: name, OrderStatus: newOrderStatus, ItemsTotal: itemsTotal, ItemsTotalWeight: itemsTotalWeight, ShippingCharge: shipping, ShippingAddress: address, OrderTotal: orderTotal, AuthorizationNumber: authorizationNumber, TimeStamp: timeStamp}}).then(updatedOrder => {

            // check if the update was successful
            if(updatedOrder.value != null){

                // loop through the entire Products table in internal DB to update the quantities based on what the customer purchased
                productsPurchased.map(product => {
                    connection.db("InternalDb").collection("Products").findOneAndUpdate({ProductID: product.ProductID}, {$inc: {Quantity: -(product.Quantity)}})
                })

                // if the update was successful, send response to client indicating success
                console.log(greenFont, "Updated order status and inserted new data\n")
                res.send({"updatedOrder": true})

            } else {
                // if the update was not successful, send response to client indicating failure
                console.log(redFont, "Failed to update order status and insert new data\n")
                res.send({"updatedOrder": false})
            }
            
        })
    })
}


function updateWeightBrackets(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to update the weight brackets (updateWeightBrackets)`)

    const newStartRange = req.body.newWeight
    const newCharge = req.body.newCharge


    mongoDb.then(connection => {

        // look through internal DB to find the weight bracket
        connection.db("InternalDb").collection("WeightBrackets").findOne({StartRange: newStartRange}).then(found => {

            if(found === null){
                // insert the updated weight bracket and shipping charge
                connection.db("InternalDb").collection("WeightBrackets").insertOne({StartRange: newStartRange, Charge: newCharge}).then(added => {
                    console.log(greenFont, "Added the new weight bracket")
                    // send response to client indicating success
                    res.send({addedWeightBracket: true})
                })
            
            } else {
                console.log(redFont, "Failed to add the new weight bracket")
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
                console.log(greenFont, "Removed the weight bracket")
                // if the removal was successful, send response to client indicating success
                res.send({removedWeightBracket: true})
            
            } else {
                console.log(redFont, "Failed to remove the weight bracket")
                // if the removal was not successful, send response to client indicating failure
                res.send({removedWeightBracket: false})
            }
        })
    })
}


function updateProductQuantity(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to update the quantity of a product (updateProductQuantity)`)
    
    const productID = req.body.productID
    let incQuantity = req.body.incQuantity

    if (incQuantity === undefined) {
        incQuantity = 0
    }

    mongoDb.then(connection => {

        // look through internal DB to find the product and update the inventory
        connection.db("InternalDb").collection("Products").findOneAndUpdate({ProductID: productID},  {$inc: {Quantity: incQuantity}}).then(updated => {
            
            if(updated.value != null){
                console.log(greenFont, "Decremented the products quantity")
                // if the update was successful, send response to client indicating success
                res.send({"updatedQauntity": true})
            } else {
                console.log(redFont, "Failed to update the products quantity")
                // if the update was not successful, send response to client indicating failure
                res.send({"updatedQuantity": false})
            }
        })
    })
}


function shipOrder(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to ship an order (shipOrder)`)

    const orderID = req.body.orderID
    const newOrderStatus = "shipped"

    mongoDb.then(connection => {

        // look through internal DB to find the order and update the status to "Shipped"
        connection.db("InternalDb").collection("Orders").findOneAndUpdate({_id: ObjectId(orderID)},  {$set: {OrderStatus: newOrderStatus}}).then(updated => {
            
            if(updated.value != null){
                console.log(greenFont, "Set order status to shipped")
                // if the update was successful, send response to client indicating success
                res.send({"shipped": true})
            } else {
                console.log(redFont, "Failed to ship the order")
                // if the update was not successful, send response to client indicating failure
                res.send({"shipped": false})
            }
        })
    })
}


export {signUpCustomer, loginCustomer, addToCart, updateCart, removeFromCart, updateOrder, updateWeightBrackets, removeWeightBracket, updateProductQuantity, shipOrder}