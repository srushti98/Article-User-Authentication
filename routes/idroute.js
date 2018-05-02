var express = require('express');
var router = express.Router();
var Article=require('../models/articles');

/* GET users listing. */
router.get('/', function(req, res,next) {
    Article.findById(req.params.id,function(err,article) {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(article);
            res.render('article',
                {

                    article: article
                });
        }
    });
});

module.exports = router;