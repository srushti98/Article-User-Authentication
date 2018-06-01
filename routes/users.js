var express = require('express');
var router = express.Router();
const bcrypt=require('bcryptjs');

let User =require('../models/user');

/* GET users listing. */
router.get('/register', function(req, res) {

  res.render('register');
});

router.post('/register',function (req,res) {

    const name=req.body.name;
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    const password1=req.body.password1;

    req.checkBody('name','name is required').notEmpty();
    req.checkBody('email','email is required').notEmpty();
    req.checkBody('email','email is not valid').isEmail();
    req.checkBody('username','username is required').notEmpty();
    req.checkBody('password','password is required').notEmpty();
    req.checkBody('password2','passwords do not match').equals(req.body.password);

    let errors=req.validationErrors();

    if(errors){
      res.render('register',{
          errors:errors
          });
    }else{
      let newUser=new User(
          {
              name:name,
              email:email,
              username:username,
              password:password
          });

      bcrypt.genSalt(10,function (err,salt) {
         bcrypt.hash(newUser.password,salt,function (err,hash) {
           if (error){
             console.log(err);
           }
            newUser.password=hash;
           newUser.save(function (err) {
              if(error){
                console.log(err);
                return;
              }else{
                req.flash('success','u are now registered and can log in');
                res.redirect('/user/login');
              }
           });
         }) ;
      });
    }
});

router.get('/login', function(req, res) {

    res.render('login');
});


module.exports = router;
