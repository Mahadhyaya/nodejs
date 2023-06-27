const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User= require('../src/userschema').Users;
const bcrypt = require('bcrypt');

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
}


const verifyCallback = (email, password, done) => {

    User.findOne({ email: email})
        .then((user) => {

            if (!user) { return done(null, false) }
            const isValid = false;
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                  console.log('Error generating salt:', err);
                  return;
                }
              
                bcrypt.hash(password, salt, (err, hash) => {
                  if (err) {
                    console.log('Error hashing password:', err);
                    return;
                  }
              
                  console.log('Hashed password:', hash);
                  isValid = bcrypt.compare(hash, user.password)
                });
            });

            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });
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





