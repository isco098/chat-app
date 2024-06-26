//import express from "express";
import express from "./../node_modules/express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "./../node_modules/body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "./../node_modules/passport";
import http from "http";
import socketio from "./../node_modules/socket.io";
import initSockets from "./sockets/index";
import cookieParser from "./../node_modules/cookie-parser";
import configSocketIo from "./config/socketio";
import events from "events";
import * as configApp from "./config/app";

// import pem from "./../node_modules/pem";
// import https from "https";

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     if (err) {
//       throw err
//     }
//     // init app
// let app = express();

// // Connect to MongoDB
// ConnectDB();

// //Config session
// configSession(app);

// // Config view engine
// configViewEngine(app);

// // Enable post data for request
// app.use(bodyParser.urlencoded({extended: true}));

// // Enable flash messages
// app.use(connectFlash());

// // Config passport js
// app.use(passport.initialize());
// app.use(passport.session());

// // Init all routes
// initRoutes(app);
// let hostname = "localhost";
// let port = 8017;

//     https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(port, hostname, () =>{
//         console.log(`hello i'm phuoc at ${hostname}:${port}`);
//     });
//   });

// init app
let app = express();

//set max connection event listener
events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listener;

// Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

// Connect to MongoDB
ConnectDB();

//Config session
session.config(app);

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

// Enable flash messages
app.use(connectFlash());

// User Cookie Parser
app.use(cookieParser());

// Config passport js
app.use(passport.initialize());
app.use(passport.session());

// Init all routes
initRoutes(app);

// Config for socket.io
configSocketIo(io, cookieParser, session.sessionStore);

// Init all sockets
initSockets(io);

let hostname = "localhost";
let port = 8017;

server.listen(port, hostname, () =>{
    console.log(`Hello i'm Phuoc at ${hostname}:${port}`);
});
// server.listen(process.env.PORT, () =>{
//     console.log(`Hello i'm Phuoc at ${process.env.PORT}`);
// });