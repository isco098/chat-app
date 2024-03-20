import passport from "./../../../node_modules/passport";
import passportGoogle from "./../../../node_modules/passport-google-oauth";
import UserModel from "./../../models/userModel";
import ChatGroupModel from "./../../models/chatGroupModel";
import {transErrors, transSuccess} from "./../../../lang/vi";

let GoogleStrategy = passportGoogle.OAuth2Strategy;

/**
 * Valid user account type: local
 */

let GG_APP_ID = "49151554216-rjqq3gv7r966e7b40tuttjrnq5l74cv3.apps.googleusercontent.com";
let GG_APP_SECRET = "MSQfTxzdPKPa7raiLcrn6_ff";
let GG_CALLBACK_URL = "https://chat-app-phuoc.herokuapp.com/auth/google/callback";

let ggAppId = GG_APP_ID;
let ggAppSecret = GG_APP_SECRET;
let ggCallbackUrl = GG_CALLBACK_URL;

let initPassportGoogle = () => {
    passport.use(new GoogleStrategy({
        clientID: ggAppId,
        clientSecret: ggAppSecret,
        callbackURL: ggCallbackUrl,
        passReqToCallback: true,
    }, async (req, accessToken, refreshToken, profile, done) =>{
        try {
            let user = await UserModel.findByGoogleUid(profile.id);
            if(user){
                return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
            }
            
            console.log(profile);
            let newUserItem = {
                username: profile.displayName,
                gender: profile.gender,
                local: {isActive: true},
                google: {
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

module.exports = initPassportGoogle;