import mongoose from "mongoose";
// import bluebird from "bluebird";
import bluebird from "./../../node_modules/bluebird";

// Connect to MongoDB

let connectDB = () =>{
    mongoose.Promise = bluebird;

    let DB_CONNECTION = "mongodb";
    let DB_HOST = "127.0.0.1";
    let DB_PORT = "27017";
    let DB_NAME = "awsome_chat";
    let DB_USERNAME = "";
    let DB_PASSWORD = "";
    // mongodb://localhost:27017/awsome_chat
    let URI = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    
    return mongoose.connect(URI, {useMongoClient: true});
};

module.exports = connectDB;
