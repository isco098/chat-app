import session from "./../../node_modules/express-session";
import connectMongo from "connect-mongo";
let MongoStore = connectMongo(session);

/**
 * This variable is where save session, in this case is mongodb
 */

let DB_CONNECTION = "mongodb";
let DB_HOST = "127.0.0.1";
let DB_PORT = "27017";
let DB_NAME = "awsome_chat";
let DB_USERNAME = "";
let DB_PASSWORD = "";

let sessionStore = new MongoStore({
    url: `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    autoReconnect: true,
    // autoRemove: "native"
});

/**
 * Config session for app
 * @param app from exactly express module
 */
let config = (app) => {
    app.use(session({
        key: "express.sid",
        secret: "mySecret",
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000*60*60*24, //86400000 seconds
        }
    }));
};

module.exports = {
    config : config,
    sessionStore : sessionStore
};
