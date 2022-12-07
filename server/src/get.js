import {legacyDb, mongoDb} from "./db.js"
import {ObjectId} from "mongodb"
import {greenFont, yellowFont, redFont} from "./server.js"


/* GET Requests */

const request = {
    type: "GET",
    number: 0
}


function getProducts(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to get all products (getProducts)`)

    // Retrieve all products from legacy database
    console.log(yellowFont, "Retriving legacy DB data...")
    legacyDb.query("SELECT * FROM parts", (err, legacyRows) => {
        if (err)
            throw err
        

        const productsList = [] //< Stores all the data for the products

        mongoDb.then(connection => {
            // Gets all the products and quantities from internal databse
            connection.db("InternalDb").collection("Products").find({}).sort({ProductID: 1}).project({_id: 0}).toArray().then((internalRows) => {

                // Combines legact database data with the corresponding internal database data
                console.log("Combining internal DB and legacy DB data...")
                for(let i = 0; i < legacyRows.length; i++) {
                    productsList.push({...legacyRows[i], ...internalRows[i]})
                }

                // Sends the data to the client
                console.log(greenFont, "Retrieved data\n")
                res.send(productsList)
            })
        })
    })
}


function getCart(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to get all products in the customers cart (getCart)`)

    const email = req.query.email
    let orderId


    mongoDb.then(connection => {

        // Looks for the customers cart
        connection.db("InternalDb").collection("Orders").findOne({Email: email, OrderStatus: "cart"}).then(openOrder => {

            
            if (openOrder != null) {
                // Found a cart
                
                orderId = openOrder._id
                connection.db("InternalDb").collection("Carts").find({OrderID: orderId}).toArray().then(cartItems => {

                    console.log(greenFont, "Found the customers cart\n")
                    res.send(cartItems)
                })

            } else {
                // No cart found
                console.log(redFont, "No cart found for the customer\n")
                res.send({openCart: false});
            }
            
        })
    })
}


function retrieveOrders(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to get orders (retrieveOrders)`)

    // Store request data
    const email = req.query.customerEmail;
    const orderState = req.query.orderStatus;


    // find all documents pertaining to requested "State": ("authorized" or "shipped")
    mongoDb.then(connection => {

        // * find() specified orders in requested state * // 
        
        // reference "InternalDb"
        var dbo = connection.db("InternalDb");
        var col = dbo.collection("Orders");
        
        if(orderState === "all") {
            // Find all the orders that are not of status 'cart'

            if(email === undefined){
                // Sends all the orders
                
                col.find({OrderStatus: {$ne: "cart"}}).sort({TimeStamp: 1}).toArray().then(listOfOrders => {
                    console.log(greenFont, "All orders found\n")
                    res.send(listOfOrders);       
                })

            } else {
                // Sends all the orders for the specified customer

                col.find({OrderStatus: {$ne: "cart"}, Email: email}).sort({TimeStamp: -1}).toArray().then(listOfOrders => {
                    console.log(greenFont, "All customer orders found\n")
                    res.send(listOfOrders);       
                })   
            }

        } else {
            // Looks for orders of specified order status

            if(email === undefined){
                // Sends all the specified orders

                col.find({OrderStatus: orderState}).sort({TimeStamp: 1}).toArray().then(listOfOrders => {
                    `All orders of status ${orderState} found`
                    res.send(listOfOrders);       
                })

            } else {
                // Sends all the specified orders for the specified customer

                col.find({OrderStatus: orderState, Email: email}).sort({TimeStamp: -1}).toArray().then(listOfOrders => {
                    console.log(greenFont, `Customer orders of status ${orderState} found\n`)
                    res.send(listOfOrders);       
                })
            }
        }
    })
}


function retrieveProductsInOrder(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to get all the products in an order (retrieveProductsInOrders)`)

    // Store request data
    const requestedID = req.query.orderID;

    // retrieve all products in cart linked to requested ID
    mongoDb.then(connection => {

        // * find() specified orders in requested state * //
        
        // reference "InternalDb"
        var dbo = connection.db("InternalDb");
        var col = dbo.collection("Carts");

        // run find
        col.find({OrderID: ObjectId(requestedID)}).toArray().then(listofProducts => {
            console.log(greenFont, "Found all the products in the specified order\n")
            res.send(listofProducts);
        })
    })
}


function getWeightBrackets (req, res) {
    console.log(`[${request.type} #${++request.number}] Request to get the weight brackets data (getWeightBrackets)`)

    mongoDb.then(connection => {

        connection.db("InternalDb").collection("WeightBrackets").find({}).sort({StartRange: 1}).project({_id: 0}).toArray().then(weightBrackets => {     
            console.log(greenFont, "Found all the weights and their charges for the brackets\n")
            res.send(weightBrackets)
        })
    })
}


export { getProducts, getCart, retrieveOrders, retrieveProductsInOrder, getWeightBrackets}