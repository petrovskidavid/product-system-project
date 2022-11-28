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

    const email = req.query.email
    let orderId


    mongoDb.then(connection => {
        connection.db("InternalDb").collection("Orders").findOne({Email: email, Open: true}).then(openOrder => {

            if (openOrder != null) {
                orderId = openOrder._id
            
                connection.db("InternalDb").collection("Carts").find({OrderID: orderId}).toArray().then(cartItems => {

                    res.send(cartItems)
                })

            } else {
                console.log("No open orders")
            }
            
        })
    })

}

function retrieveOrders(req, res) {
    // Store request data
    const orderState = req.query.State;
    
    // error checking data sent
    if (orderState == undefined) {
        throw "request data was undefined";
        return;
    }
    
    // find all documents pertaining to requested "State": ("authorized" or "shipped")
    mongoDb.then(connection => {
        // log
        console.log(yellowFont, `Fetching all ${orderState} orders...`);

        // * find() specified orders in requested state * // 
        
        // reference "InternalDb"
        var dbo = connection.db("InternalDb");
        var col = dbo.collection("Orders");
        
        // run find
        col.find({OrderStatus: orderState}).toArray().then(listOfOrders => {
            res.send(listOfOrders);       
        })
    })
}

function retrieveProductsInOrder(req, res) {
    // Store request data
    const requestedID = req.query.ID;

    // error check request data
    if (orderState == undefined) {
        throw "request data was undefined";
        return;
    }

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


export { getProducts, getCart, retrieveOrders, retrieveProductsInOrder}
