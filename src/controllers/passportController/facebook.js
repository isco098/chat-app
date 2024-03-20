import passport from "./../../../node_modules/passport";
import passportFacebook from "./../../../node_modules/passport-facebook";
import UserModel from "./../../models/userModel";
import ChatGroupModel from "./../../models/chatGroupModel";
import {transErrors, transSuccess} from "./../../../lang/vi";

let FacebookStrategy = passportFacebook.Strategy;

/**
 * Valid user account type: local
 */

let FB_APP_ID = "FB_APP_ID";
let FB_APP_SECRET = "FB_APP_SECRET";
let FB_CALLBACK_URL = "FB_CALLBACK_URL";

let fbAppId = FB_APP_ID;
let fbAppSecret = FB_APP_SECRET;
let fbCallbackUrl = FB_CALLBACK_URL;

let initPassportFacebook = () => {
    passport.use(new FacebookStrategy({
        clientID: fbAppId,
        clientSecret: fbAppSecret,
        callbackURL: fbCallbackUrl,
        passReqToCallback: true,
        profileFields: ["email", "gender", "displayName"]
    }, async (req, accessToken, refreshToken, profile, done) =>{
        try {
            let user = await UserModel.findByFacebookUid(profile.id);
            if(user){
                return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
            }
            
            console.log(profile);
            let newUserItem = {
                username: profile.displayName,
                gender: profile.gender,
                local: {isActive: true},
                facebook: {
                    uid: profile.id,
                    token: accessToken,
                    email: profile.emails[0].value,
                }
            };
            let newUser = await UserModel.createNew(newUserItem);
            return done(null, newUser, req.flash("success", transSuccess.loginSuccess(newUser.username)));
        } catch (error) {
            console.log(error);
            return done (null, false, req.flash("errors",transErrors.server_error))
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    //This is called by passport.session()
    //return userInfo to req.user
    passport.deserializeUser(async (id,done) => {
        try {
            let user = await UserModel.findUserByIdForSessionToUse(id);
            let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);
            
            user = user.toObject();
            user.chatGroupIds = getChatGroupIds;

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    });
};

module.exports = initPassportFacebook;