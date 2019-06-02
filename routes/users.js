var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/user');

router.use(bodyParser.json());

//== Route for user Signup ==//
router.post("/signup", (req, res, next) => {
  User.findOne({username : req.body.username})
  .then((user) => {
    if(user != null){
      var err = new Error("User name " + req.body.username + " already exists!!");
      //err.status = 403;
      next(err);
    }else{
      return User.create({
        username: req.body.username,
        password : req.body.password
      });
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({status: "Registration Successfull", user:user});
  }, (err) => {console.log(err);})
  .catch((err) => next(err));
});

//== Route for user Login ==//
router.post('/login', (req, res, next) => {
  
    if(!req.session.user) {
      var authHeader = req.headers.authorization;
      
      if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
      }
    
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      var username = auth[0];
      var password = auth[1];
      console.log(username, password)
      User.findOne({username: username})
      .then((user) => {
        console.log(JSON.stringify(user));
        if (user === null) {
          var err = new Error('User ' + username + ' does not exist!');
          err.status = 403;
          return next(err);
        }
        else if (user.password != password) {
          var err = new Error('Your password is incorrect!');
          err.status = 403;
          return next(err);
        }
        else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!')
        }
      })
      .catch((err) => next(err));
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
    }
})

//== Route for user logout ==//
router.get("/logout", (req, res, next) => {
  if(req.session){
    req.session.destroy();
    res.redirect("/");
  }else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
