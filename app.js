var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const  mongoose=require('mongoose');
var Article=require('./models/articles');

mongoose.connect('mongodb://localhost/articles');
let db=mongoose.connection;

//check connections

db.once('open',function () {
   console.log('connected to MongoDb')
});


//check for db errors

db.on('error',function (err) {
  console.log(err);
});

var indexRouter = require('./routes/index');
//var idRouter = require('./routes/idroute');
var addRouter = require('./routes/add');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/article/:id', idRouter);
app.use('/articles/add',addRouter);
app.use('/users', usersRouter);

//for individual article
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
      res.send('Deleted successfully');
   });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

/*app.post('/articles/add',function (req,res) {         .....it works in respective file not here some reason
   //let article=new Article();
   //article.title=req.body.title;
   console.log(req.body.title);
})*/
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
