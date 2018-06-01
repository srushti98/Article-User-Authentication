const express= require('express');
const router=express.router();

app.get('/article/:id',function (req,res) {
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

//for edit article
app.get('/article/edit/:id',function (req,res) {
    Article.findById(req.params.id,function(err,article) {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(article);
            res.render('edit_article',
                {
                    title:'edit article',
                    article: article
                });
        }
    });
});
app.post('/article/edit/:id',function (req,res) {
    let article={};
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;
    console.log(article);
    let query={_id:req.params.id}

    Article.update(query,article,function (err) {
        if(err){
            console.log('its in save');
            console.log(err);
            return;
        }
        else
        {
            req.flash('success','article editted');
            console.log(article);
            console.log('done');
            res.redirect('/');
        }

    });

});

app.delete('/article/:id',function (req,res) {
    let query = {_id:req.params.id}

    Article.remove(query, function (err) {
        if(err)
        {
            console.log(err);
        }
        req.flash('danger','article deleted');
        res.send('Deleted successfully');
    });
});