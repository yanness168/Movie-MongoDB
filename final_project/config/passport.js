const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userSchema");
const bcrypt = require('bcryptjs');
/* const session = require('express-session');
const passport = require('passport'); */

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: "email"}, function(
            email,
            password,
            /* The done callback function takes in two arguments: 
            An error or null if no error is found.
            A user or false if no user is found. */
            done
        ){
            let filter = {email: email};
            User.findOne(filter,function(err,user){
                //if(err) return done(err);
                if(err){
                    console.log(err);
                }

                if (!user) {
                    return done( null,false, { message: "User is not found in the database" });
                };

                bcrypt.compare(password, user.password, function(err,isMatch){
                    if(err){
                        console.log(err);
                    }
                    if(isMatch) {
                        return done(null,user);
                    }else{
                        return done(null,false,{ message: "Invalid credentials" });
                    }
                });
            });
        })
    );


    //Serialize user determines which data of the user object should be stored in the session, 
    //usually the user id
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    //For any subsequent request, the user object can be retrieved from the session via the deserializeUser() function
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            if(err){
                done(null, false, {errors: err});
            }
            done(err,user);
        });
    });
};