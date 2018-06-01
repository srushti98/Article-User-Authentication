var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const  mongoose=require('mongoose');
var Article=require('./models/articles');
const expressValidator=require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');

mongoose.connect('mongodb://localhost/nodekb');
let db=mongoose.connection;

//check connections

db.once('open',function () {
   console.log('connected to MongoDb');
});


//check for db errors

db.on('error',function (err) {
  console.log(err);
});

let users=require('./routes/users');
var indexRouter = require('./routes/index');
//var idRouter = require('./routes/idroute');
var addRouter = require('./routes/add');
var usersRouter = require('./routes/users');
//var articles = require('./routes/articles');

var app = express();

app.use('/users',users);

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

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true

}));
//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
//express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

app.use('/', indexRouter);

app.use('/articles/add',addRouter);
app.use('/users', usersRouter);
//app.use('/articles',articles);
//app.use('/article/:id', idRouter);    //tip:/:id should always be in the bottom because other routes also tries to access /:id

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
