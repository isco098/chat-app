import passportSocketIo from "./../../node_modules/passport.socketio";

let configSocketIo = (io, cookieParser, sessionStore) => {
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: "express.sid",
        secret: "mySecret",
        store: sessionStore,
        success: (data, accept) => {
            if(!data.user.logged_in){
                return accept("invalid user", false);
            }
            return accept(null, true);
        },
        fail:(data, message, error, accept) => {
            if(error){
                console.log("failed connection to socket.io:", message);
                return accept (new Error(message), false);
            }
        }
    }));
};

module.exports = configSocketIo;