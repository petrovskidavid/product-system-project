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


function getWeightBrackets (req, res) {
    console.log(`\n[${request.type} #${++request.number}] Request to get the weight brackets data (getWeightBrackets)`)


    mongoDb.then(connection => {

        connection.db("InternalDb").collection("WeightBrackets").find({}).sort({StartRange: 1}).project({_id: 0}).toArray().then(weightBrackets => {
            
            res.send(weightBrackets)
        })
    })
}

export {getProducts, getCart, getWeightBrackets}