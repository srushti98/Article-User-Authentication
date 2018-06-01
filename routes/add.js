var express = require('express');
let Article=require('../models/articles');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('add', { title: 'add articles' });
    // res.render('index');
});
router.post('/',function (req,res) {

    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    //get errors

    let errors=req.validationErrors();

    if(errors)
    {
        res.render('add',{
            title: 'add articles',
           errors:errors
        });
    }
    else
    {
        let article=new Article();
        article.title=req.body.title;
        article.author=req.body.author;
        article.body=req.body.body;

        article.save(function (err) {
            if(err){
                console.log('its in save');
                console.log(err);
                return;
            }
            else
            {

                req.flash('success','Article added');
                console.log('done');
                res.redirect('/');
            }

        });
    }


});
module.exports = router;