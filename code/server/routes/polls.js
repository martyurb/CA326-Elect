var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var _ = require('lodash');
var Poll = require('../models/Poll');
var User = require('../models/User');
var Vote = require('../models/Vote')
const jwt = require('jsonwebtoken');
const pgp = require('openpgp');
const priv_key = require('../conf/keys').privKey;
const pub_key = require('../conf/keys').pub_key;


const secret = "oiwerl43ksmpoq5wieurxmzcvnb9843lj3459k";

// Verify the JWT
function verifyToken(token){
  return jwt.verify(token, secret);
}

function getGroupedVotes(poll){
  Vote.find({pollid: poll.pollid}, function(err, result) {

    if (err) {throw err;}
    if (result) {
      var grouped = _.groupBy(result, 'option')
      console.log(grouped);
      Object.keys(grouped).map(function (key, index) {
        grouped[key] = grouped[key].length;
      });
      console.log(grouped);
      return grouped;
    }
}

function majorityWins(poll) {
  const groupedVotes = getGroupedVotes(poll);
  const values = Object.values(groupedVotes);
  const summed = _.sum(values);
  const maxOption = _.max(values);
  if (summed/2 <= maxOption) {
    Object.entries(groupedVotes).forEach(
    ([key, value]) => {
      if (value == maxOption)  {
        return(key, value);
        }
      }
    );
  }
}



function resultByPollType(poll) {
  if (poll.voteType.code === 1) {

  }

}

router.post('/cast-secure', (req, res) => {

  let token = req.body.token;
  let verifiedToken = verifyToken(token);
  let pollid = req.body.pollid;
  User.findOne({userid: verifiedToken.userid}, function(err, user) {

    if (err) console.log(err);
    else if (user) {
      let encryptedVote = req.body.encryptedVote;
      let pr_key = priv_key;
      let pu_key = pub_key;

      const decryptVote = async(pr_key, pu_key, encryptedVote) => {

        const privKeyObj = (await pgp.key.readArmored(pr_key));
        await privKeyObj.keys[0].decrypt('oiwerl43ksmpoq5wieurxmzcvnb9843lj3459ks');

        msg = await pgp.message.readArmored(encryptedVote);

        let doptions = {
          message: msg,
          privateKeys: [privKeyObj.keys[0]],
          publicKeys: pgp.key.readArmored(pu_key).keys,
        };

        let decypted_vote = await pgp.decrypt(doptions).then((signedVote) => {
          return signedVote
        });

        return decypted_vote;

      }

      decryptVote(pr_key, pu_key, encryptedVote).then(signedVote => {

        const sender_pub_key = user.publicKey;

        console.log(signedVote.data);

        const verify_sig = async(sender_pub_key, signedVote) => {

          options = {
            message: await pgp.cleartext.readArmored(signedVote), // parse armored message
            publicKeys: (await pgp.key.readArmored(sender_pub_key)).keys // for verification
          };
        
          pgp.verify(options).then(function(verified) {
            validity = verified.signatures[0].valid; // true
            if (validity) {
                console.log(validity);
                console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
                console.log(verified);
                Poll.findOne({pollid: pollid}, function(err, poll) {
                  if (err) return res.status(401).json({message: "Poll not found"});
                  else if (poll) {
                    const date = new Date();
                    const nowTimestamp = date.getTime();
            
                    var record = new Vote({
                      created_at: nowTimestamp,
                      pollid: pollid,
                      author: user.userid,
                      option: verified.data
                    });
            
                    record.save( (err, vote) => {
                      if(err){
                        console.log(err);
                        return res.status(500).json({message: "db error"});
                      } else {
                        return res.status(201).json({message: true});
                      }
                    });
                  } else {
                    console.log("no poll found");
                  }
                })
            } else {
              console.log("Invalid signature, sender can not be verified!");
            }
          });
        }

        verify_sig(sender_pub_key, signedVote.data);
        
      });


      
    };
  });
});


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
            isSecure = req.body.poll.isSecure;
            //closingTimestamp = req.body.poll.closeTimestamp
            //isOpen = true;

            var record = new Poll({
              created_at: timestamp,
              pollid: pollid,
              author: user.userid,
              voteType: type,
              title: title,
              options: options,
              isSecure: isSecure
              //close_at: closeTimestamp
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
            const isSecure = poll.isSecure;
            return res.status(200).json({title: title, options: options, id: id, isSecure: isSecure});
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
});

router.post('/all', function(req, res) {
  let token = req.body.token;
  console.log("Here");
  let verifiedToken = verifyToken(token);
  User.findOne({userid: verifiedToken.userid}, function(err, user) {
    if (err) return res.status(401).json({message: false});
    else if (user) {
      Poll.find({author: verifiedToken.userid}, function(err, polls) {
        if (err) return res.status(401).json({message: false});
        else if (polls) {
          console.log(polls)
          return res.status(200).json({message: true, polls: polls});
        } else {
          return res.status(401).json({message: false});
        }
      });
    } else {
      return res.status(401).json({message: false});
    }
  })
});

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

router.post('/cast', function(req, res) {
  console.log(req.body);
  let token = req.body.token;
  let verifiedToken = verifyToken(token);
  let pollid = req.body.vote.pollid;
  let option = req.body.vote.option;

  console.log(req);

  User.findOne({userid:verifiedToken.userid}, function(err, user){
    if (err) return res.status(401).json({message: "User not found"});
    else if (user) {
      Poll.findOne({pollid: pollid}, function(err, poll) {
      if (err) return res.status(401).json({message: "Poll not found"});
      else if (poll) {
        const date = new Date();
        const nowTimestamp = date.getTime();

        var record = new Vote({
          created_at: nowTimestamp,
          pollid: pollid,
          author: user.userid,
          option: option
        });

        record.save( (err, vote) => {
          if(err){
            console.log(err);
            return res.status(500).json({message: "db error"});
          } else {
            return res.status(201).json({message: true});
          }
        });
      }
    })
  }})
})

router.post('/result', function(req , res) {

    Poll.findOne({pollid: req.body.id}, function(err, poll) {
      if (err) { throw err;}
      if (poll) {
        Vote.find({pollid: req.body.id}, function(err, result) {

          if (err) {throw err;}
          if (result) {
            var grouped = _.groupBy(result, 'option')
            console.log(grouped);
            Object.keys(grouped).map(function (key, index) {
              grouped[key] = grouped[key].length;
            });
            console.log(grouped);
            return res.status(200).json({grouped: grouped});
          }
        }
      );
      }
      else {
        return res.status(404).json({message: "error"});
      }
    })
});



router.get('/:id/result', function(req , res) {
  User.findOne({userid:verifiedToken.userId}, function(err, user){
    if (err) return res.status(401).json({message: "User not found"});
    else if (user) {
      Poll.findOne({pollid: pollid}, function(err, poll) {
      if (err) return res.status(401).json({message: "Poll not found"});
      else if (poll) {
        const date = new Date();
        const nowTimestamp = date.getTime();

        var record = new Vote({
          created_at: nowTimestamp,
          pollid: pollid,
          author: user.userid,
          option: option
        });

        record.save( (err, vote) => {
          if(err){
            console.log(err);
            return res.status(500).json({message: "db error"});
          } else {
            return res.status(201).json({message: true});
          }
        });
      }
    })
  }})
})

router.get('/result', function(req , res) {
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
    })
})



module.exports = router;
