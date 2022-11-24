const express = require('express');
const user_router = express.Router();
const bcrypt = require('bcryptjs');
//var session = require('express-session');
const passport = require("passport");
var {check, validationResult} = require('express-validator');
const User = require('../models/userSchema');

user_router.route("/register")
    .get(function (req, res){
        res.render('register', {title:"Register"});
    })
    .post(async function (req,res){
        await check('name', "Name is required!").notEmpty().run(req);
        await check('email', "Email is required!").notEmpty().run(req);
        await check('password', "Password is required!").notEmpty().run(req);
        await check('confirm_password', "You need to confirm password!").notEmpty().run(req);
        await check('confirm_password', "Your passwords do not match").equals(req.body.password).run(req);

        const errors = validationResult(req);
        if(errors.isEmpty()){
            let user = new User();
            user.name = req.body.name;
            user.email = req.body.email;

            const saltRounds = 10;

            bcrypt.genSalt(saltRounds, function(err, salt){
                bcrypt.hash(req.body.password, salt, function(err,result){
                    if(err){
                        console.log(err);
                    }else{
                        user.password = result;
                        user.save(function(err){
                            if(err){
                                console.log(err);
                                return;
                            }else{
                                res.redirect('/user/login');
                            }
                        })
                    }
                })
            })
        }else{
            res.render('register',{errors:errors.array()})
        }
    })

user_router.route("/login")
    .get(function(req,res){
        res.render('login',{title:"Login"})
    })
    .post(async function(req,res,next){
        await check('email', "Email is required!").notEmpty().run(req);
        await check("email", "Email is invalid").isEmail().run(req);
        await check('password', "Password is required!").notEmpty().run(req);

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            // Authenticate using passport and redirect
            passport.authenticate("local", {
              successRedirect: "/",
              failureRedirect: "/user/login",
              failureMessage: true,
            })(req, res, next);
          } else {
            // If form errors then render login with errors
            res.render("login", {
              errors: errors.array(),
            });
          }
    })

user_router.get("/logout", function (req, res) {
    // Function to logout user
    req.logout();
    req.session.destroy();
    res.redirect('/');
    });
    
module.exports = user_router;
