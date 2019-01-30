var express = require('express');
var router = express.Router();
var Poll = require('../models/Poll');

var auth = require('./auth.js').

const jwt = require('jsonwebtoken');

const secret = "oiwerl43ksmpoq5wieurxmzcvnb9843lj3459k";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Poll' });
});

router.post('/new', fuction(req,res) {
    authorid = req.body.authorid
    title = req.body.title
    type = req.body.type
    voteOptions = req.body.voteOptions


    var record = new Poll({
      authorId : authorid,
      title: token,
      type: type,
      voteOptions: voteOptions

})
