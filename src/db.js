import mysql from "mysql"
import mongodb from "mongodb"
import dotenv from "dotenv"


// Configures environment variables
dotenv.config()


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
const mongoDb = mongoClient.connect(process.env.MONGO_DB);


export {legacyDb, mongoDb}