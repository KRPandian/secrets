//jshint esversion:6
require('dotenv').config() ;
const express = require("express") ;
const bodyParser = require("body-parser") ;
const ejs = require("ejs") ;
const mongoose = require("mongoose") ;
const bcrypt = require("bcrypt") ;

const saltRounds = 10 ;

const app = express() ;

app.use(bodyParser.urlencoded({extended: true})) ;

app.set('view engine', 'ejs') ;
app.use(express.static("public")) ;

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true}) ;

const userSchema = new mongoose.Schema({
  user: String,
  password: String
}) ;

const User = new mongoose.model("User", userSchema) ;

app.post("/register", (req, res)=>{
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if(!err) {
      const newUser = new User( {
        user: req.body.username,
        password: hash
      }) ;
      newUser.save(function(err){
        if(!err){
          res.render("secrets") ;
        } else {
          res.send(err) ;
        }
      }) ;
    }
  }) ;

}) ;

app.post("/login", (req,res)=>{
  User.findOne({user: req.body.username}, function(err, foundUser){
    if(!err) {
      if(foundUser) {
        bcrypt.compare(req.body.password, foundUser.password, function(err, result){
          if(result === true) {
            res.render("secrets") ;
          }
          else {
            res.send("<h3>Username or password incorrect!<h3>") ;
          }
        }) ;
      }
      else {
        res.send("<h3>Username or password incorrect!<h3>") ;
      }
    }
  }) ;
}) ;


PORT = 3000 ;


app.get("/", (req, res)=>{
  res.render("home") ;
}) ;

app.get("/login", (req, res)=>{
  res.render("login") ;
}) ;

app.get("/register", (req, res)=>{
  res.render("register") ;
}) ;


app.listen(3000, function(){
  console.log("Server started in port "+PORT) ;
})
