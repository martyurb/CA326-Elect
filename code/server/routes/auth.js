var express = require('express');
var router = express.Router();
var User = require('../models/User');

const jwt = require('jsonwebtoken');

const secret = "oiwerl43ksmpoq5wieurxmzcvnb9843lj3459k";

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
      const aud = payload['aud'];

      if(aud != process.env.CLIENT_ID){
        return false;
      } else {
        return true;
      }
    }
   
    result = verify(req.body.id_token);
   
    email = req.body.email;
    token = req.body.id_token;
    userid = req.body.userid;

    if (result != false) {

      let user;

      User.findOne({email: email},function(err,doc){
          if(err) {return res.status(500).json({message:'error occured'})}
          else {
            if(doc) {
              user = doc;
              const retToken = jwt.sign({email: user.email, userid: user.userid}, secret, { expiresIn: "1h"});
              return res.status(200).json({
                token: retToken,
                expiresIn: 3600,
                userid: user.userid
              });
            }
            else {
              var record = new User({
                userid: userid,
                idToken: token,
                email: email
              });

              record.save(function(err,user) {
                if(err){
                  return res.status(500).json({message: 'db error'});
                } else {
                  const retToken = jwt.sign({email:user.email, userid: user.userid }, secret, { expiresIn: "1h" });
                  return res.status(200).json({
                    token: retToken,
                    expiresIn: 3600,
                    userid: user.userid
                  });
                }
              });
            }
          }
        }
      );
    }
    
})


module.exports = router;
