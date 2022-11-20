import mysql from "mysql"
import mongodb from "mongodb"

// Creates a connection to the legacy database
const legacyDb = mysql.createConnection({
    host: 'blitz.cs.niu.edu',
    user: 'student',
    password: 'student',
    database: 'csci467'
});

legacyDb.connect()


// Creates a connection to the internal MongoDB database
const mongoClient = mongodb.MongoClient;
const mongoDb = mongoClient.connect("mongodb+srv://testing:testingDB@csci-467-project.rxzknis.mongodb.net/?retryWrites=true&w=majority");


export {legacyDb, mongoDb}