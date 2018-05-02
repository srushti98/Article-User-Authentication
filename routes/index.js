var express = require('express');
//let Article=require('./models/articles');
let Article=require('../models/articles');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    Article.find({},function (err,articles) {
        if(err)
        {
            console.log(err);
        }
        else {
            res.render('index',
                {
                    title: 'articles',
                    articles: articles
                });
        }
    });
 /* let articles=[
      {
        id:1,
        title:'article one',
        author:'srushti',
        body:'this is first article'
      },
      {
          id:2,
          title:'article two',
          author:'aditi',
          body:'this is second article'
      },
      {
          id:3,
          title:'article three',
          author:'chaitu',
          body:'this is third article'
      }
  ]*/

});

module.exports = router;
