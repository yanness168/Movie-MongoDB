const express = require('express');
const movieR = express.Router();
var {check, validationResult} = require('express-validator');

const Movie = require('../models/movieSchema');
const User = require('../models/userSchema');

movieR.route('/single/:id')
    .get(ensureAuthenticated, function (req, res){
        Movie.findById(req.params.id, function (err, movie){
            User.findById(movie.posted_by, function (err, user){
              res.render('specificmovie', {movie, title: movie.name, posted_by: user.name})
            })
        })
    })
    .delete(function(req,res){
        let deleteFilter = {_id:req.params.id}

        Movie.findById(req.params.id, function(err,movie){
          if(movie.posted_by !== res.user.id){
            res.status(500).send();
          }
        })
    })

movieR.route('/add')
    .get(ensureAuthenticated, function (req,res){
        res.render('addmovie', {title: 'Add movie'})
    })
    .post(ensureAuthenticated, async function (req,res){
        await check('name', "Need a name!").notEmpty().run(req);
        await check('director', "Need a director!").notEmpty().run(req);
        await check('year', "Need the released year!").notEmpty().run(req);
        await check('description', "Need a description!").notEmpty().run(req);
        await check('rating', "Need a rating number (0-10)!").isFloat({min:0, max:10}).run(req);
        await check('genres', "You forgot genres!").notEmpty().run(req);

        const errors = validationResult(req);

        if(errors.isEmpty()){
            let movie = new Movie();

            movie.name = req.body.name;
            movie.description = req.body.description;
            movie.director = req.body.director;
            movie.year = req.body.year;
            const genresArr = req.body.genres.split(/[,.;\n]/)
            movie.genres = genresArr.filter(v=> v!="");
            movie.rating = req.body.rating;
            movie.posted_by = req.user._id

            movie.save(function(err){
                if(err){
                    console.log(err);
                    return;
                }else{
                    res.redirect('/')
                }
            })
        }else{
            res.render('addmovie',{
              errors:errors.array(),
              title: 'Add movie',
            })
        }
    })

movieR.route('/single/edit/:id')
    .get(ensureAuthenticated,function(req,res){
        Movie.findById(req.params.id, function(err, movie){
          if(movie.posted_by !== req.user.id){
            res.redirect('/')
          }
          res.render('editmovie',{movie,title: "Edit "+movie.title})
        })
    })
    .post(ensureAuthenticated, function(req,res){
        var updates = {};
        Movie.findById(req.params.id, function(err,movie){
            updates = movie;
        })
        if(req.body.description!== ""){
            updates.description = req.body.description;
        }
        if(req.body.director!== ""){
            updates.director = req.body.director;
        }
        if(req.body.year!== ""){
            updates.director = req.body.year;
        }
        if(req.body.rating!== ""){
            updates.director = req.body.rating;
        }
        if(req.body.genres!== ""){
            const genresArr = req.body.genres.split(/[.;\n]/)
            updates.genres = genresArr.filter(v=>v!="");
        }
        
        let filter = {_id:req.params.id}
        Movie.findById(req.params.id, function (err,movie){
          if(movie.posted_by !== req.user.id){
            res.redirect("/")
          }else{
            Movie.updateOne(filter, updates, function(err, updateDoc){
              if(err){
                  console.log(err)
              }else{
                  console.log(updateDoc);
                  res.redirect('/');
              }
          })
          }
        })
    })

function ensureAuthenticated(req,res,next){
    //If loogged in proceed to "next()"
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect("/user/login")
    }
}

module.exports = movieR;