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
    // let URI = `mongodb://awesome-chat01:Pahm1995@awesome-chat-shard-00-00.ocv9m.mongodb.net:27017/awesome_chat?ssl=true&replicaSet=atlas-13hv22-shard-0&authSource=admin&retryWrites=true&w=majority`
    
    return mongoose.connect(URI, {useMongoClient: true});
};

module.exports = connectDB;
