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


export {internalDb, legacyDb}