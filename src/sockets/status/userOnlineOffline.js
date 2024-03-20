import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param io from socket.io lib
 */
let userOnlineOffline = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });

        // khi co nhom chat moi
        socket.on("new-group-created", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
        });

        socket.on("member-received-group-chat", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
        });

        socket.on("check-status", () => {
            let listUsersOnline = Object.keys(clients);
            //01: Emit to user after login or refresh
            socket.emit("server-send-list-users-online", listUsersOnline);

            //02: emit to all orther user when new user online
            socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);

        });

        socket.on("disconnect", () => {
            clients = removeSocketIdToArray(clients, socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdToArray(clients, group._id, socket);
            });
            //emit to all orther user when new user offline
            socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);
        });
    });
}

module.exports = userOnlineOffline;