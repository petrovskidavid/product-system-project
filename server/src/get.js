import {legacyDb, mongoDb} from "./db.js"
import {greenFont, yellowFont, redFont} from "./server.js"


/* GET Requests */

const request = {
    type: "GET",
    number: 0
}

// Gets all the products from the legacy and internal database and combines then to the client side
function getProducts(req, res) {
    console.log(`[${request.type} #${++request.number}] Request to get all products (getProducts)`)

    // Retrieve all products from legacy database
    console.log(yellowFont, "Retriving legacy DB data...")
    legacyDb.query("SELECT * FROM parts", (err, legacyRows) => {
        if (err)
            throw err
        

        for(let i = 0; i < legacyRows.length; i++) {
            
            // mongoDb.then(connection => {

            //     connection.db("InternalDb").collection("Products").insertOne({"_id": legacyRows[i].number, "ProductID": legacyRows[i].number, "Quantity": (Math.floor(Math.random() * 100))}).then(res => {
            //         console.log(res)
            //     })
            // })
        }

        const productsList = [] //< Stores all the data for the products

        mongoDb.then(connection => {
            // Gets all the products and quantities from internal databse
            console.log(yellowFont, "Retriving internal DB data...")
            connection.db("InternalDb").collection("Products").find({}).sort({ProductID: 1}).project({_id: 0}).toArray().then((internalRows) => {

                // Combines legact database data with the corresponding internal database data
                console.log("Combining data...")
                for(let i = 0; i < legacyRows.length; i++) {
                    productsList.push({...legacyRows[i], ...internalRows[i]})
                }

                // Sends the data to the client
                res.send(productsList)
                console.log(greenFont, "Sent response to client\n")
            })
        })
    })
}


function getCart(req, res) {
    console.log(`\n[${request.type} #${++request.number}] Request to get all products in the customers cart (getCart)`)

    const email = req.query.email
    let orderId


    mongoDb.then(connection => {
        console.log(yellowFont, "Looking for customers cart...")
        connection.db("InternalDb").collection("Orders").findOne({Email: email, OrderStatus: "cart"}).then(openOrder => {

            if (openOrder != null) {
                console.log(greenFont, "Customer cart found")
                
                orderId = openOrder._id

                console.log("Retriving cart data...")
                connection.db("InternalDb").collection("Carts").find({OrderID: orderId}).toArray().then(cartItems => {

                    res.send(cartItems)
                    console.log(greenFont, "Sent response to client\n")
                })

            } else {

                console.log(redFont, "No customer cart found")
                // res.send({openCart: false});
                // console.log(greenFont, "Sent response to client\n")
            }
            
        })
    })
}


function retrieveOrders(req, res) {
    // Store request data
    const email = req.query.customerEmail;
    const orderState = req.query.orderStatus;


    // find all documents pertaining to requested "State": ("authorized" or "shipped")
    mongoDb.then(connection => {
        // log
        console.log(yellowFont, `Fetching all ${orderState} orders...`);

        // * find() specified orders in requested state * // 
        
        // reference "InternalDb"
        var dbo = connection.db("InternalDb");
        var col = dbo.collection("Orders");
        
        if(orderState === "all") {

            if(email === undefined){
                // run find
                col.find({OrderStatus: {$ne: "cart"}}).sort({TimeStamp: -1}).toArray().then(listOfOrders => {
                    res.send(listOfOrders);       
                })

            } else {
                // run find
                col.find({OrderStatus: {$ne: "cart"}, Email: email}).sort({TimeStamp: -1}).toArray().then(listOfOrders => {
                    res.send(listOfOrders);       
                })   
            }

        } else {

            if(email === undefined){
                // run find
                col.find({OrderStatus: orderState}).sort({TimeStamp: -1}).toArray().then(listOfOrders => {
                    res.send(listOfOrders);       
                })

            } else {
                col.find({OrderStatus: orderState, Email: email}).sort({TimeStamp: -1}).toArray().then(listOfOrders => {
                    res.send(listOfOrders);       
                })
            }
        }
    })
}


function retrieveProductsInOrder(req, res) {
    // Store request data
    const requestedID = req.query.ID;


    // retrieve all products in cart linked to requested ID
    mongoDb.then(connection => {
        // logging
        console.log(yellowFont, "Fetching all products in cart with requested ID");

        // * find() specified orders in requested state * //
        
        // reference "InternalDb"
        var dbo = connection.db("InternalDb");
        var col = connection.db("Carts");

        // run find
        col.find({OrderID: requestedID}).toArray().then(listofProducts => {
            res.send(listofProducts);
        })
    })
}


function getWeightBrackets (req, res) {
    console.log(`\n[${request.type} #${++request.number}] Request to get the weight brackets data (getWeightBrackets)`)


    mongoDb.then(connection => {

        connection.db("InternalDb").collection("WeightBrackets").find({}).sort({StartRange: 1}).project({_id: 0}).toArray().then(weightBrackets => {
            
            res.send(weightBrackets)
        })
    })
}


export { getProducts, getCart, retrieveOrders, retrieveProductsInOrder, getWeightBrackets}