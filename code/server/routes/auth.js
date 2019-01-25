var express = require('express');
var router = express.Router();
var User = require('../models/User')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

/* GET home page. */
router.get('/auth', function(req, res, next) {
  res.render('index', { title: 'Auth' });
});

router.post('/login', function(req, res) {
    // Verify Google OAuth Token
    async function verify(token) {
      const ticket = await client.verifyIdToken({idToken: token, audience: process.env.CLIENT_ID});
      
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      const aud = payload['aud'];
      const name = payload['name'];
      const photo = payload['picture'];
      const email = payload['email'];
      const idToken = token;

      if(aud != process.env.CLIENT_ID){
        return false;
      } else {
        return true;
      }
    }
   
    result = verify(req.body.id_token);
   
    email = req.body.email;
    token = req.body.id_token;

    if (result != false) {
      User.findOne({email: email},function(err,doc){
          if(err) {return res.status(500).json({message:'error occured'})}
          else {
            if(doc) {
              return res.status(201).json({message:'user already exsits'})
            }
            else {
              var record = new User({
                idToken: token,
                email: email
              });

              record.save(function(err,user) {
                if(err){
                  return res.status(500).json({message: 'db error'});
                } else {
                  return res.status(201).json({message: "User created"})
                }
              });
            }
          }
        }
      );
    }
    
})


module.exports = router;
