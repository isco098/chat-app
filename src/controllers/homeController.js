import {notification, contact, message} from "./../services/index";
import {bufferToBase64, lastItemOfArray, convertTimestampToHumanTime} from "./../helpers/clientHelper";
import request from "./../../node_modules/request";

let getICETurnServer = () => {
    return new Promise(async (resolve, reject) => {
        // let o = {
        //     format: "urls"
        // };
        
        // let bodyString = JSON.stringify(o);
        
        // let options = {
        //     url: "https://global.xirsys.net/_turn/awsome-chat",
        //     // host: "global.xirsys.net",
        //     // path: "/_turn/awsome-chat",
        //     method: "PUT",
        //     headers: {
        //         "Authorization": "Basic " + Buffer.from("isco098:d609889a-07b2-11ec-b16f-0242ac130003").toString("base64"),
        //         "Content-Type": "application/json",
        //         "Content-Length": bodyString.length
        //     }
        // };

        // //Call a request to get ICE list of turn server 
        // request(options, (error, response, body) =>{
        //     if(error){
        //         console.log("Error ICE list: " + error);
        //         return reject(error);
        //     }
        //     let bodyJson = JSON.parse(body);
        //     resolve(bodyJson.v.iceServers);
        // });
        resolve([]);
    });
};

let getHome = async (req, res) =>{
    //chỉ hiển thị 10 thông báo trong bảng 
    let notifications = await notification.getNotifications(req.user._id); 
    // lấy số lượng thông báo chưa đọc
    let countNotifUnread = await notification.countNotifUnread(req.user._id);
    
    // lấy 10 contact
    let contacts = await contact.getContacts(req.user._id);
    // lấy 10 contact đã gửi
    let contactsSent = await contact.getContactsSent(req.user._id);
    // lấy 10 contact đã nhận
    let contactsReceived = await contact.getContactsReceived(req.user._id);

    let countAllContacts = await contact.countAllContacts(req.user._id);
    let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
    let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

    let getAllConversationItems = await message.getAllConversationItems(req.user._id);

    let allConversationWithMessages = getAllConversationItems.allConversationWithMessages

    // get ICE list from xirsys turnserver
    let iceServerList = await getICETurnServer();

    return res.render("main/home/home",{
        errors: req.flash("errors"),
        success: req.flash("success"),
        user: req.user,
        notifications: notifications,
        countNotifUnread: countNotifUnread,
        contacts: contacts,
        contactsSent: contactsSent,
        contactsReceived: contactsReceived,
        countAllContacts: countAllContacts,
        countAllContactsSent: countAllContactsSent,
        countAllContactsReceived: countAllContactsReceived,
        allConversationWithMessages: allConversationWithMessages,
        bufferToBase64: bufferToBase64,
        lastItemOfArray: lastItemOfArray,
        convertTimestampToHumanTime: convertTimestampToHumanTime,
        iceServerList: JSON.stringify(iceServerList),
    });
};

module.exports = {
    getHome : getHome,
};