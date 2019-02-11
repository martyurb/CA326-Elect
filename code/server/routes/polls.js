var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var Poll = require('../models/Poll');
var User = require('../models/User');
const jwt = require('jsonwebtoken');

const secret = "oiwerl43ksmpoq5wieurxmzcvnb9843lj3459k";

// Verify the JWT
function verifyToken(token){
  return jwt.verify(token, secret);
}


//Dynamic poll route
router.get('/:id', function(req , res){
  Poll.findOne({pollid: req.body.id}, function(err, poll) {
    //To do - add redirect to 404
    if (err) res.render('404 Poll not found');
    else if (poll) {
      res.render(poll.title)
    }
  })
  res.render('poll' + req.body.id);

})


// Create New poll
router.post('/new', function(req, res) {
  //check if a valid user is creating a new poll
  let token = req.body.token;
  let verifiedToken = verifyToken(token);

  User.findOne({userid:verifiedToken.userid}, function(err, user) {
    if (err) return res.status(401).json({message: "User not found"});
      else if (user) {
      //gen a randomid and check db for dublicate
      const pollid = randomstring.generate(7);

      Poll.findOne({pollid: pollid},function(err,doc){
          if (err) { return res.status(500).json({message: "An error occured when searching for the user"}); }
          if(!doc) {
            title = req.body.title;
            options = req.body.options;
            isOpen = true;

            var record = new Poll({
              pollid: pollid,
              author: user.userid,
              title: title,
              options: options,
              isOpen: isOpen
            });

            console.log(record);

            record.save( (err, poll) => {
              if(err){
                console.log(err);
                return res.status(500).json({message: "db error"});
              } else {
                return res.status(201).json({message: "added new poll"})
              }
            });
          }
          else {
            if(doc) {
              //temp - add logic for when dublicate pollid is generated
              return res.status(500).json({message: "error"});
            }
          }
        });
      }
    });
});

// Close a poll
router.post('/close'), function(req, res) {
  let token = req.body.token;
  let verifiedToken = verifyToken(token);
  let pollid = req.body.pollid;

  User.findOne({userid:verifiedToken.userid}, function(err, user) {
    if (err) return res.status(401).json({message: "User not found"});
    else if (user) {
      Poll.findOne({pollid:pollid}, function(err, poll) {
        if (err) return res.status(401).json({message: "Poll not found"});
        else if (poll.author === user.userid) {
          Poll.findOneAndUpdate({pollid:pollid}, {isOpen: false})
            .then((updatedPoll) => {
              if (updatedPoll) {
                return res.status(201).json({message: true, isOpen: false});
              } else {
                return res.status(500).json({message: "error"});
              }
            })
        }
      })
    }
  })
}


module.exports = router;
