import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param io from socket.io lib
 */
let newGroupChat = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });

        socket.on("new-group-created", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);

            let response = {
                groupChat: data.groupChat,
            };

            data.groupChat.members.forEach(member => {
                if(clients[member.userId] && member.userId != socket.request.user._id){
                    emitNotifyToArray(clients, member.userId, io, "response-new-group-created", response);
                }
            });
        });

        socket.on("member-received-group-chat", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
        });

        socket.on("disconnect", () => {
            clients = removeSocketIdToArray(clients, socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdToArray(clients, group._id, socket);
            });
        });
        // console.log(clients);
    });
}

module.exports = newGroupChat;