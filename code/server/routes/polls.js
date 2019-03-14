var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var _ = require('lodash');
var Poll = require('../models/Poll');
var User = require('../models/User');
var Vote = require('../models/Vote');
const jwt = require('jsonwebtoken');
const pgp = require('openpgp');
const priv_key = require('../conf/keys').priv_key;
const pub_key = require('../conf/keys').pub_key;
const secret = require('../conf/keys').secret;

// Verify the JWT
function verifyToken(token){
  return jwt.verify(token, secret);
}

function getGroupedVotes(poll) {
  Vote.find({pollid: poll.pollid}, function(err, result) {

    if (err) {throw err;}
    if (result) {
      var grouped = _.groupBy(result, 'option');

      Object.keys(grouped).map(function (key, index) {
        grouped[key] = grouped[key].length;
      });

      return grouped;
    }
  })
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
  if (poll.voteType.code === 2) {
    return majorityWins(poll);
  }

}

router.post('/getStatsLine', function(req, res) {
  let pollid = req.body.pollid;

  //get all votes for the poll
  Vote.find({pollid: pollid}, function(err, votes) {
    if (err) throw err;
    if (votes) {


      //find max and min timestamp (timestamps of first and last vote)
      const maxtime = _.maxBy(votes, function(o) { return o.created_at; }).created_at;
      const mintime = _.minBy(votes, function(o) { return o.created_at; }).created_at;
      const difference = maxtime - mintime;

      //group data by vote option
      let grouped = _.groupBy(votes, function(o) { return o.option; });

      //amount of data points to generate
      const dataPoints = 7;
      const step = difference / dataPoints;

      //gen array with values from min to max time in step intervals
      let timestamps = new Array(dataPoints).fill(0).map((e,i)=> mintime+(step * (i + 1)));

      //[obj's] for results
      let chartData = new Array(Object.keys(grouped).length);

      var k = 0;
      Object.entries(grouped).forEach(([key, value]) => {
        var obj = {};
        var curTime = mintime + step;
        var dataArray = new Array(dataPoints);
        var i = 0;
        timestamps.forEach((timestamp) => {
          var p = 0;
          value.forEach((vote) => {
            if (vote.created_at <= timestamp) {
              p = p + 1;
            }
          })
          dataArray[i] = p;
          i = i + 1;
        });
        dataArray = [0].concat(dataArray);
        console.log('thishere', dataArray);
        console.log(value[0].option);
        obj["data"] = dataArray;
        obj["label"] = value[0].option;
        chartData[k] = obj;
        k = k + 1;
        }
      );
    return res.status(201).json(chartData);
    }
  })
});

router.post('/cast-secure', (req, res) => {

  let token = req.body.token;
  let verifiedToken = verifyToken(token);
  let pollid = req.body.pollid;
  console.log(pollid)
  User.findOne({userid: verifiedToken.userid}, function(err, user) {

    if (err) throw err;

    else if (user) {
      let encryptedVote = req.body.encryptedVote;
      let pr_key = priv_key;
      let pu_key = pub_key;

      const decryptVote = async(pr_key, pu_key, encryptedVote) => {
        console.log("HERE");
        const privKeyObj = (await pgp.key.readArmored(pr_key));
        await privKeyObj.keys[0].decrypt("oiwerl43ksmpoq5wieurxmzcvnb9843lj3459ks");
        console.log("ALSO HER");
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

                    if (poll.close_at < nowTimestamp) {
                      return res.status(500).json({message: false});
                    }

                    var record = new Vote({
                      created_at: nowTimestamp,
                      pollid: pollid,
                      author: user.userid,
                      option: verified.data
                    });

                    record.save( (err, vote) => {
                      if(err){
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

});

// Create New poll
router.post('/create', function(req, res) {
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

            //change timestamps - time should be acquired from server instead of client for security and consistency
            //timestamp = req.body.poll.timestamp;
            date = new Date();
            timestamp = date.getTime();
            title = req.body.poll.title;
            options = req.body.poll.options;
            type = req.body.poll.type;
            isSecure = req.body.poll.isSecure;
            close_at = "32511473755000";

            if (req.body.poll.close_at != "") {
              closingDate = new Date(req.body.poll.close_at);
              close_at = closingDate.getTime();
            }
            //isOpen = true;

            var record = new Poll({
              created_at: timestamp,
              pollid: pollid,
              author: user.userid,
              voteType: type,
              title: title,
              options: options,
              isSecure: isSecure,
              close_at: close_at

              //close_at: closeTimestamp
            });

            console.log(record);

            record.save( (err, poll) => {
              if(err){
                console.log(err);
                return res.status(500).json({message: "db error"});
              } else {
                return res.status(201).json({message: true, pollid: poll.pollid})
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


        User.findOne({userid: verifiedToken.userid}, function(err, user) {
          if (err) { throw err; }
          if (user) {
            const title = poll.title;
            const options = poll.options;
            const id = poll.pollid;
            const isSecure = poll.isSecure;
            if (nowTimestamp > closeTimestamp) {
              return res.status(200).json({title: title, options: options, id: id, isSecure: isSecure, isOpen: false});
            }
            return res.status(200).json({title: title, options: options, id: id, isSecure: isSecure, isOpen: true});
          } else {
            return res.status(500).json({message: "Something went wrong"});
            }
        })

    }
    else {
      return res.status(300).json({message: "Couldn't find poll with id: " + pollid});
    }
  })
});

router.post('/all', function(req, res) {
  let token = req.body.token;
  let verifiedToken = verifyToken(token);
  User.findOne({userid: verifiedToken.userid}, function(err, user) {
    if (err) return res.status(401).json({message: false});
    else if (user) {
      Poll.find({author: verifiedToken.userid}, function(err, polls) {
        if (err) return res.status(401).json({message: false});
        else if (polls) {
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
router.post('/close', function(req, res) {
  let token = req.body.token;
  let verifiedToken = verifyToken(token);
  let pollid = req.body.pollid;

  User.findOne({userid:verifiedToken.userid}, function(err, user) {
    if (err) return res.status(401).json({success: false, message: "User not found"});
    else if (user) {
      Poll.findOne({pollid:pollid}, function(err, poll) {
        if (err) return res.status(401).json({success: false, message: "Poll not found"});
        else if (poll.author === user.userid) {
          const date = new Date();
          const nowTimestamp = date.getTime();
          Poll.findOneAndUpdate({pollid:pollid}, {close_at:nowTimestamp})
            .then((updatedPoll) => {
              if (updatedPoll) {
                return res.status(201).json({success: true, message: "Poll closed"});
              } else {
                return res.status(500).json({success: false, message: "error"});
              }
            })
        }
      })
    }
  })
});

router.post('/cast', function(req, res) {
  let token = req.body.token;
  let verifiedToken = verifyToken(token);
  let pollid = req.body.vote.pollid;
  let option = req.body.vote.option;

  User.findOne({userid:verifiedToken.userid}, (err, user) => {
    if (err) throw err;
    if (user) {
      Poll.findOne({pollid: pollid}, (err, poll) => {
        if (err) throw err;
        if (poll) {
          const date = new Date();
          const nowTimestamp = date.getTime();
          //if poll is closed return 500
          if (poll.close_at < nowTimestamp) {
            return res.status(500).json({message: false});
          }

          var record = new Vote({
            created_at: nowTimestamp,
            pollid: pollid,
            author: user.userid,
            option: option
          });

          record.save((err, vote) => {
            if (err) return res.status(500).json({message: "db error"});;
            if (vote) {
              return res.status(201).json({message: true});
            } else if (!vote) {
              return res.status(500).json({message: "db error"});
            }
          });
        } else if (!poll){
          return res.status(500).json({message: "db error"});
        }
      });
    } else if (!user) {
      return res.status(500).json({message: "db error"});
    }
  })
});

router.post('/result', function(req , res) {

    Poll.findOne({pollid: req.body.id}, function(err, poll) {
      if (err) { throw err;}
      if (poll) {
        Vote.find({pollid: req.body.id}, function(err, result) {

          if (err) {throw err;}
          if (result) {
            var grouped = _.groupBy(result, 'option')
            Object.keys(grouped).map(function (key, index) {
              grouped[key] = grouped[key].length;
            });
            return res.status(200).json({grouped: grouped});
          }
        });
      }
      else {
        return res.status(404).json({message: "error"});
      }
    })
});



// router.get('/:id/result', function(req , res) {
//   User.findOne({userid:verifiedToken.userId}, function(err, user){
//     if (err) return res.status(401).json({message: "User not found"});
//     else if (user) {
//       Poll.findOne({pollid: pollid}, function(err, poll) {
//       if (err) return res.status(401).json({message: "Poll not found"});
//       else if (poll) {
//         const date = new Date();
//         const nowTimestamp = date.getTime();

//         var record = new Vote({
//           created_at: nowTimestamp,
//           pollid: pollid,
//           author: user.userid,
//           option: option
//         });

//         record.save( (err, vote) => {
//           if(err){
//             console.log(err);
//             return res.status(500).json({message: "db error"});
//           } else {
//             return res.status(201).json({message: true});
//           }
//         });
//       }
//     })
//   }})
// })

// router.get('/result', function(req , res) {
//     Poll.findOne({pollid: req.body.id}, function(err, poll) {
//       if (err) throw err;
//       if (poll) {
//         vote.find({pollid: req.body.id}.toArray(function(err, result) {
//           if (err) {throw err;}
//           if (result) {
//             var grouped = _.groupBy(result, 'option')

//             Object.keys(grouped).map(function (key, index) {
//               grouped[key] = grouped[key].length;
//             });
//             return res.render(grouped);
//           }
//         }
//       ));
//       }
//       else {
//         return res.status(404).json({message: "error"});
//       }
//     })
// })

router.post('/can-access', function(req, res) {
  let token = req.body.token;
  let verifiedToken = verifyToken(token);
  let userid = verifiedToken.userid;
  let pollid = req.body.pollid;
  Poll.findOne({pollid: pollid}, function(err, poll) {
    if (err) throw err;
    if (poll) {
      if (poll.author == userid) {
        return res.status(200).json({canAccess: true});
      } else {
        return res.status(200).json({canAccess: false});
      }
    } else {
      return res.status(301).json({canAccess: false});
    }
  })
});

router.post('/get-poll', function(req, res) {
  let token = req.body.token;
  let verifiedToken = verifyToken(token);
  let userid = verifiedToken.userid;
  let pollid = req.body.pollid;
  User.findOne({userid: userid}, function(err, user) {
    if (err) throw err;
    if (user) {
      Poll.findOne({pollid: pollid}, function(err, poll) {
        if (err) throw err;
        if (poll) {
          return res.status(200).json({message: true, poll: poll});
        } else {
          return res.status(301).json({message: false, poll: null});
        }
      })
    } else {
      return res.status(301).json({message: false, poll: null});
    }
  })

});

router.post('/get-votes', function(req, res) {
  let token = req.body.token;
  let verifiedToken = verifyToken(token);
  let userid = verifiedToken.userid;
  let pollid = req.body.pollid;

  User.findOne({userid: userid}, function(err, user) {
    if (err) throw err;
    if (user) {
      Vote.find({pollid: pollid}, function(err, votes) {
        if (err) throw err;
        if (votes) {
          return res.status(200).json({message: true, votes: votes});
        } else if (!votes) {
          return res.status(301).json({message: false, votes: null});
        }
      })
    } else {
      return res.status(301).json({message: false, votes: null});
    }
  });
});



module.exports = router;
