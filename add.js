var express = require('express');
let Article=require('../models/articles');
const crypto=require('crypto');
const multer  = require('multer');
const GridFsStorage=require('multer-gridfs-storage');
var router = express.Router();
//get in multer

var upload = multer({ dest: 'public/uploads/' });

/*const storage=multer.diskStorage({
   destination:function (req,file,cb) {
       cb(null,'./uploads/');
   },
   filename:function (req,file,cb) {
       cb(null,new Date().toISOString()+file.originalname);

   }
});*/
//const upload=multer({storage:storage});
//create storage engine
/*const storage = new GridFsStorage({
    url: 'mongodb://localhost/nodekb',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});*/
//var upload = multer({ storage });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('add', { title: 'add articles' });
    // res.render('index');
});
router.post('/',upload.single('file'),function (req,res) {

    //console.log(req.file);
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
        //gets in file path
        article.file=req.file.path;
        article.save(function (err) {
            if(err){
                console.log('its in save');
                console.log(err);
                return;
            }
            else
            {

                req.flash('success','Article added');
                console.log(req.files);
                res.redirect('/');
            }

        });
    }


});
module.exports = router;