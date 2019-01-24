var express = require('express');
var router = express.Router();
var User = require('../models/User')


/* GET home page. */
router.get('/auth', function(req, res, next) {
  res.render('index', { title: 'Auth' });
});

router.post('/login', function(req, res) {
    var body = req.body;
    email = req.email;
    token = req.idToken;
    console.log(body)
    User.findone({email=email},function(err,doc)){
      if(err) {return res.status(500).send('error occured')}
      else {
        if(doc) {
          return res.status(201).send('user already exsits')
        }
        else {
          var record = new User()
          record.email = email;
          record.idToken = idToken;
          record.save(fuction(err,user){
            if(err){
              return res.status(500).send('db error')
            } else {
              return res.send(user)
            }
          }
        }
      }
    }
  });
})


module.exports = router;
