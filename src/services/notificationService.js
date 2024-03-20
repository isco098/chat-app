import NotificationModel from "./../models/notificationModel";
import UserModel from "./../models/userModel";

const LIMIT_NUMBER_TAKEN = 10;
/**
 * Lấy 10 thông báo khi f5 lại trang web
 * @param {string} currentUserId 
 */
let getNotifications = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, LIMIT_NUMBER_TAKEN);
            
            let getNotifContents = notifications.map(async (notification) => {
                let sender = await UserModel.getNormalUserDataById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
            });
            resolve( await Promise.all(getNotifContents));
        } catch (error) {
            reject(error)
        }
    })
};

/**
 * đếm tất cả  thông báo
 * @param {string} currentUserId 
 */
let countNotifUnread = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
            resolve(notificationsUnread);
        } catch (error) {
            reject(error)
        }
    })
};

/**
 * Xem thêm 10 thông báo
 * @param {strign} currentUserId 
 * @param {string} skipNumberNotification 
 */
let readMore = (currentUserId, skipNumberNotification) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newNotifications = await NotificationModel.model.readMore(currentUserId, skipNumberNotification, LIMIT_NUMBER_TAKEN);
            
            let getNotifContents = newNotifications.map(async (notification) => {
                let sender = await UserModel.getNormalUserDataById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
            });
            resolve( await Promise.all(getNotifContents));
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Đánh dấu thông báo đã đọc
 * @param {string} currentUserId 
 * @param {array} targetUsers 
 */
let markAllAsRead = (currentUserId, targetUsers) => {
    return new Promise(async (resolve, reject) => {
        try {
            await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
            resolve(true);
        } catch (error) {
            console.log(`Error when mark notifications as read: ${error}`);
            reject(error);
        }
    })
};

module.exports = {
    getNotifications : getNotifications,
    countNotifUnread : countNotifUnread,
    readMore : readMore,
    markAllAsRead: markAllAsRead,
}