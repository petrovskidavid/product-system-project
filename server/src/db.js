import mysql from "mysql"

// Creates a connection to the legacy database
const legacyDb = mysql.createConnection({
    host: 'blitz.cs.niu.edu',
    user: 'student',
    password: 'student',
    database: 'csci467'
});

legacyDb.connect()


// Creates a connection to the legacy database
const internalDb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'product-system-db'
});

internalDb.connect()


// Initializes the internal database with default quantity values for the products if possible
legacyDb.query("SELECT * FROM parts", (err, legacyRows) => {
    if (err)
        throw err
    
    /* 
        Loops through all the products from the legacy database, checks if they are in internal database
        and if not it inserts them with a default quantity in the Product table
    */
    for(let i = 0; i < legacyRows.length; i++) {
        
        // Only runs if the given ProductID is not in the Products table
        internalDb.query("INSERT IGNORE INTO Products VALUES (?, ?)", [legacyRows[i].number, 20], (err, internalRows) => {
            if (err)
                throw err
        })
    }
})


export {internalDb, legacyDb}