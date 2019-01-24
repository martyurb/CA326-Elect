var express = require('express');
var router = express.Router();
var User = require('../models/User')


/* GET home page. */
router.get('/auth', function(req, res, next) {
  res.render('index', { title: 'Auth' });
});

router.post('/login', function(req, res) {
    var body = req.body;
    email = req.body.email;
    token = req.body.id_token;
    console.log(body)
    User.findOne({email:email},function(err,doc){
      if(err) {return res.status(500).json({message:'error occured'})}
      else {
        if(doc) {
          return res.status(201).json({message:'user already exsits'})
        }
        else {
          var record = new User()
          record.email = email;
          record.idToken = token;
          record.save(function(err,user) {
            if(err){
              return res.status(500).json({message: 'db error'});
            } else {
              return res.send(user)
            }
          }
          )}
      }
    }
  );
})


module.exports = router;
