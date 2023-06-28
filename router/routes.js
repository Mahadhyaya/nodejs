const express = require('express')
const router = express.Router();
const userController = require('../src/userController')
const user = require('../src/userschema')
// const passport = require('../config/passport');
// const { Passport } = require('passport');


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User= require('../src/userschema').Users;
const bcrypt = require('bcrypt');

const customFields = {
    usernameField: 'emailid',
    passwordField: 'password'
}


const verifyCallback = (emailid, password, done) => {

    User.findOne({ emailid: emailid})
        .then((user) => {

            if (!user) { return done(null, false) }
            console.log(password);
            console.log(user.password);
            // const isValid = bcrypt.compare(password, user.password)
            bcrypt.compare(password, user.password)
            .then((isValid) => {
                if (isValid) {
                return done(null, user);
                } else {
                return done(null, false);
                }
            })
            .catch((err) => {
                done(err);
            });
        })
}

const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});









router.route('/user/getAll').get(userController.getDataController);

router.route('/user/create').post(userController.createDataController);

router.route('/items/:itemId').put(userController.updateDataController).patch(userController.falseRemoveDataController);
router.route('/user/register').post(userController.registerUser);
router.route('/user/login').post(passport.authenticate('local'), userController.loginUser);
router.route('/user/logout').get((req, res) => {
    req.session.destroy();
    res.json({ redirect: '/login' });
    // (error) => {
    //     if (error) {
    //       console.error('Error destroying session:', error);
    //       res.status(500).json({ error: 'Server error' });
    //     } else {
    //       res.clearCookie(req.session.cookie); // Replace 'session' with the actual name of your session cookie
    //       res.json({ redirect: '/login' });
    //     }
    //   }
});
module.exports = router;