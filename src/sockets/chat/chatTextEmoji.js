import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdToArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param io from socket.io lib
 */
let chatTextEmoji = (io) => {
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

        socket.on("chat-text-emoji", (data) => {
            if(data.groupId){
                let response = {
                    currentGroupId: data.groupId,
                    currentUserId: socket.request.user._id,
                    message: data.message
                };
                if(clients[data.groupId]){
                    emitNotifyToArray(clients, data.groupId, io, "response-chat-text-emoji", response);
                }
            }
            if(data.contactId){
                let response = {
                    currentUserId: socket.request.user._id,
                    message: data.message
                };
                if(clients[data.contactId]){
                    emitNotifyToArray(clients, data.contactId, io, "response-chat-text-emoji", response);
                }
            }
            
            
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

module.exports = chatTextEmoji;