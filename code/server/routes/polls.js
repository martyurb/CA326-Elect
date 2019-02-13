var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var _ = require('lodash');
var Poll = require('../models/Poll');
var User = require('../models/User');
var Vote = require('../models/Vote')
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

// router.post('/create', function(req, res) {
//   let token = req.body.token;
//   let poll = req.body.poll;
//   console.log(token, poll);
// })

// Create New poll
router.post('/create', function(req, res) {
  //check if a valid user is creating a new poll
  console.log(req.body.poll);
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

            //change timestamps - time should be acquired from server instead of client for security and consistency
            //timestamp = req.body.poll.timestamp;
            date = new Date();
            timestamp = date.getTime();
            title = req.body.poll.title;
            options = req.body.poll.options;
            type = req.body.poll.type;
            closingTimestamp = req.body.poll.closeTimestamp
            //isOpen = true;

            var record = new Poll({
              created_at: timestamp,
              pollid: pollid,
              author: user.userid,
              voteType: type,
              title: title,
              options: options,
              close_at: closeTimestamp
            });

            console.log(record);

            record.save( (err, poll) => {
              if(err){
                console.log(err);
                return res.status(500).json({message: "db error"});
              } else {
                return res.status(201).json({message: true, pollid: pollid})
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

router.post('/fetch', function(req, res) {
  let token = req.body.token;
  let pollid = req.body.pollid;
  let verifiedToken = verifyToken(token);

  Poll.findOne({pollid: pollid}, function(err, poll) {
    if (err) { throw err; }
    if (poll) {
      const closeTimestamp = poll.close_at
      const date = new Date();
      const nowTimestamp = date.getTime();

      //check if current time is past close time. If true then poll is over and redirect to result page
      if (nowTimestamp > closeTimestamp) {
        return res.redirect('result');
      } else {
        User.findOne({userid: verifiedToken.userid}, function(err, user) {
          if (err) { throw err; }
          if (user) {
            const title = poll.title;
            const options = poll.options;
            const id = poll.pollid;
            return res.status(200).json({title: title, options: options, id: id});
          } else {
            return res.status(500).json({message: "Something went wrong"});
            }
        })
      }
    }
    else {
      return res.status(300).json({message: "Couldn't find poll with id: " + pollid});
    }
  })
})

// Close a poll
router.post('/close'), function(req, pollInfores) {
  let token = req.body.token;
  let verifiedToken = verifyToken(token);
  let pollid = req.body.pollid;

  User.findOne({userid:verifiedToken.userid}, function(err, user) {
    if (err) return res.status(401).json({message: "User not found"});
    else if (user) {
      Poll.findOne({pollid:pollid}, function(err, poll) {
        if (err) return res.status(401).json({message: "Poll not found"});
        else if (poll.author === user.userid) {
          const date = new Date();
          const nowTimestamp = date.getTime();
          Poll.findOneAndUpdate({pollid:pollid}, {close_at:nowTimestamp})
            .then((updatedPoll) => {
              if (updatedPoll) {
                return res.status(201).json({success: true});
              } else {
                return res.status(500).json({message: "error"});
              }
            })
        }
      })
    }
  })
}



router.get('/:id/result', function(req , res) {
    Poll.findOne({pollid: req.body.id}, function(err, poll) {
      if (err) { throw err;}
      if (poll) {
        vote.find({pollid: req.body.id}.toArray(function(err, result) {
          if (err) {throw err;}
          if (result) {
            var grouped = _.groupBy(result, 'option')

            Object.keys(grouped).map(function (key, index) {
              grouped[key] = grouped[key].length;
            });
            return res.render(grouped);
          }
        }
      ));
      }
      else {
        return res.status(404).json({message: "error"});
      }
    }
}


module.exports = router;
