var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var cloudinary = require('cloudinary');
var cdConfig = require('../cloud.js');
cloudinary.config(cdConfig);
// Mongoose import
var mongoose = require('mongoose');
var Idea = require('../models/idea.js')
var Adm = require('../models/rmbh.js')

router.post('/profile', function(req, res, next) {
  cloudinary.uploader.upload(req.body.url, function(result) {
    res.json(result);
  }, { public_id: req.body.name });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  Idea.find({ type: "LineString" },{}, function (err, docs) {
          res.render('index',  {ideas: docs, user : req.user} );
      });
});

router.get('/debate', function(req, res, next) {
  Idea.find({ type: "LineString" },{}, function (err, docs) {
          res.render('debate',  {ideas: docs, user : req.user} );
      });
});

//route to get all ideas

router.get('/all', function(req, res, next) {
  Idea.find({ type: "LineString" },{}, function (err, data) {
          res.json(data);
      });
});

router.get('/rmbh', function(req, res, next) {
  Adm.findOne(function (err, data) {
          res.json(data);
      });
});

//route to send email

router.get('/send', function(req, res, next) {
  var helper = require('sendgrid').mail;
  from_email = new helper.Email(req.query.replyTo);
  to_email = new helper.Email(process.env.EMAIL_SG);
  subject = req.query.subject;
  content = new helper.Content("text/plain", req.query.text);
  mail = new helper.Mail(from_email, subject, to_email, content);

  var sg = require('sendgrid').SendGrid(process.env.SG_KEY)
  var requestBody = mail.toJSON()
  var request = sg.emptyRequest()
  request.method = 'POST'
  request.path = '/v3/mail/send'
  request.body = requestBody
  sg.API(request, function (response) {
    console.log(response.statusCode)
    console.log(response.body)
    console.log(response.headers)
  });
  res.json({message: 'Nice'})
});

//Route to render add idea page
router.get('/addidea', function(req, res, next) {
  res.render('addidea',  {user:req.user} );
});

router.get('/colormap', function(req, res, next) {
  res.render('map',  {user:req.user} );
});

router.get('/disclaimer', function(req, res, next) {
  res.render('disc',  {user:req.user} );
});

//Route to render contact page
router.get('/contato', function(req, res, next) {
  res.render('contato',  {user:req.user} );
});

//Route to render project page
router.get('/projeto', function(req, res, next) {
  res.render('projeto',  {user:req.user} );
});

router.get('/login', function(req, res, next) {
  res.render('signin');
});

//Route to Find by user'
router.get('/ideasfind/:user', function (req, res) {
  Idea.find({"user.username": req.params.user}, function(err, data) {
    if (err)
    res.send(err);
  res.render('user', {data, user:req.user});
  });
});

//Route to adm by COD_UP'
router.get('/rmbhmap/:NOM_UP', function (req, res) {
  Adm.find({}, {features: {$elemMatch: {"properties.NOM_UP": req.params.NOM_UP}}}, function(err, data) {
    Idea.find({ coordinates : {$geoIntersects : { $geometry : data[0].features[0].geometry}}}, function(err, docs) {
      if (err)
        res.send(err);
      res.json(docs);
    })
  })
});

//Route to Find by Id
router.get('/ideasfind2/:idea_id', function (req, res) {
  Idea.findById(req.params.idea_id, function(err, data) {
    if (err)
    res.send(err);
  res.json(data);
  });
});

//Route to User Find by Id
router.get('/userfind/:Account_id', function (req, res) {
  Account.findById(req.params.Account_id, function(err, data) {
    if (err)
    res.send(err);
  res.json(data);
  });
});

//Route to Show Idea
router.get('/ideas/:idea_id', function (req, res) {
  Idea.findById(req.params.idea_id, function(err, docs) {
    if (err)
    res.send(err);
  res.render('showidea', {
    ideaId: docs._id,
    judgers: docs.judgers,
    userProp: docs.user,
    description: docs.desc,
    references: docs.refs,
    comments: docs.comments,
    date: docs.date,
    user: req.user,
    rating: docs.rating
  });
});
});

//Route to post new idea
router.post('/newidea', function(req, res) {

 var idea = new Idea();

  idea.type = "LineString";
  idea.refs = req.body.refs;
  idea.desc = req.body.desc;
  idea.rating = 5;
  idea.judgers = req.body.judger;
  idea.date = req.body.date;
  idea.user = req.body.user;
  idea.coordinates = req.body.coordinates.map(function (pair) {
    return pair.map(Number);
  });

  // Save the idea and check for errors
  idea.save(function(err) {
    if (err)
      res.send(err);
    res.json({ message: 'You have got an idea!', data: idea});
  });
});

//Route to delete idea
router.delete('/deleteidea/:id', function(req, res) {
  // Use the Beer model to find a specific beer and remove it
  Idea.findByIdAndRemove(req.params.id, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Idea deleted' });
  });
});

// Route to Comment
router.put('/addcomment/:id', function(req, res) {
  Idea.findById(req.params.id, function(err, docs) {
    if (err)
      res.send(err);
    // update likes or comments
    docs.comments.push(req.body.ncomment);
    // Save the updates and check for errors
    docs.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Idea updated'});
    });
  });
});

// Route to Rate
router.put('/rate/:id', function(req, res) {
  Idea.findById(req.params.id, function(err, docs) {
    if (err)
    res.send(err);
    // update likes or comments
    docs.rating.push(req.body.rating);
    docs.judgers.push(req.body.judger);
    // Save the updates and check for errors
    docs.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Idea updated'});
    });
  });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username, email : req.body.email, picture : req.body.picture }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }
        passport.authenticate('local')(req, res, function () {
            res.json({user:req.user, message: 'User Registered'});
        });
    });
});

router.post('/user/login', passport.authenticate('local'), function(req, res) {
    res.json({ message: 'Logged'});
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// route for facebook authentication and login
// different scopes while logging in
router.get('/login/facebook',
	passport.authenticate('facebook', { scope: ['email'] }
));

// handle the callback after facebook has authenticated the user
router.get('/login/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect : '/',
		failureRedirect : '/'
	})
);



module.exports = router;
