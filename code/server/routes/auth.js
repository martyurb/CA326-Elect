var express = require('express');
var router = express.Router();
var User = require('../models/User');
var pgp = require('openpgp');
var TestUser = require('../models/TestUser');
var secret = require('../conf/keys').secret;

const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

/* GET home page. */
router.get('/auth', function(req, res, next) {
  res.render('index', { title: 'Auth' });
});

// Verify the JWT
function verifyToken(token){
  return jwt.verify(token, secret);
}

// Generate a PGP key pair for given user
router.post('/keys/generate', function(req, res) {
  console.log("HERE");
  let token = req.body.token;
  let verifiedToken = verifyToken(token);

  User.findOne({userid:verifiedToken.userid}, function(err, user) {
    if (err) return res.status(401).json({message: "User not found"});
    else if (user) {
      var options = {
        userIds: [{userid: verifiedToken.userid, }],
        numBits: 1024,
        passphrase: secret
      }

      pgp.generateKey(options).then(function(key) {
        var privKey = key.privateKeyArmored;
        var publicKey = key.publicKeyArmored;
        User.findOneAndUpdate({userid:verifiedToken.userid}, {publicKey:publicKey})
          .then((updatedUser) => {
            if (updatedUser) {
              return res.status(201).json({message: true, privKey: privKey});
            } else {
              return res.status(500).json({message: "error"});
            }
          })
      });
    }
  })
})

// Handle user uploaded public key
router.post('/keys/upload', function(req, res) {
  let token = req.body.token;
  let verifiedToken = verifyToken(token);

  let publicKey = req.body.publicKey;
  User.findOneAndUpdate({userid:verifiedToken.userid}, {publicKey:publicKey})
    .then((updatedUser) => {
      if (updatedUser) {
        return res.status(201).json({message: true});
      }
      else{
        return res.status(401).json({message:false});
      }
    });
})

// Return account key information
router.post('/keys', function(req, res) {
  let token = req.body.token;
  let verifiedToken = verifyToken(token);

  User.findOne({userid:verifiedToken.userid}, function(err, user) {
    if (err) return res.status(200).json({message: "Can't find user"});
    else {
      if (user) {
        if (user.publicKey) {
          return res.status(200).json({isKeySet: true, key: user.publicKey});
        } else {
          return res.status(200).json({isKeySet: false});
        }
      }
    }
  })
})

// Return a users account information
router.post('/account', function(req, res) {
  let token = req.body.token;

  let verifiedToken = verifyToken(token);

  User.findOne({userid:verifiedToken.userid}, function(err, user) {
    if (err) return res.status(400).json({message:"Cant find user"});
    else{
      return res.status(200).json({email: user.email, name: user.fullname, photo: user.photo});
    }
  });
})


// Log the user in or create an account then log in
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
    name = req.body.name;
    image = req.body.image;
    token = req.body.id_token;
    userid = req.body.userid;

    if (result != false) {

      let user;

      User.findOne({email: email},function(err,doc){
          if(err) {return res.status(500).json({message:'error occured'})}
          else {
            if(doc) {
              user = doc;
              const retToken = jwt.sign({email: user.email, userid: user.userid}, secret);
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
                email: email,
                photo: image,
                fullname: name,
              });

              console.log(record);

              record.save( (err,user) => {
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
