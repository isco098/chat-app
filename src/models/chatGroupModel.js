import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
    name: String,
    userAmount: {type: Number, min: 3, max: 100},
    messageAmount: {type: Number, default: 0},
    userId: String,
    members: [
        {userId: String}
    ],
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: Date.now},
    deletedAt: {type: Number, default: null},
});

ChatGroupSchema.statics = {
    createNew(item) {
        return this.create(item);
    },
    /**
     * 
     * @param {string} userId 
     * @param {number} limit 
     */
    getChatGroups(userId, limit){
        return this.find({
            "members": {$elemMatch: {"userId": userId}}
        }).sort({"updatedAt": -1}).limit(limit).exec();
    },

    getChatGroupById(id){
        return this.findById(id).exec();
    },

    /**
     * 
     * @param {string} id 
     * @param {number} newMessageAmount 
     */
    updateWhenHasNewMessage(id, newMessageAmount){
        return this.findByIdAndUpdate(id, {
            "messageAmount" : newMessageAmount,
            "updatedAt": Date.now()
        }).exec();
    },

    getChatGroupIdsByUser(userId){
        return this.find({
            "members": {$elemMatch: {"userId": userId}}
        },{_id: 1}).exec();
    },

    readMoreChatGroup(userId, skip, limit){
        return this.find({
            "members": {$elemMatch: {"userId": userId}}
        }).sort({"updatedAt": -1}).skip(skip).limit(limit).exec();
    }
};

module.exports = mongoose.model("chat-group", ChatGroupSchema);