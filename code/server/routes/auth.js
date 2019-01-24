var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/auth', function(req, res, next) {
  res.render('index', { title: 'Auth' });
});

router.post('/login', function(req, res) {
    var body = req.body;
    email = req.email;
    token = req.idToken;
    console.log(body)
    return res.status(200).json({
      token: "test",
      expiresIn: 45328,
    });
})


module.exports = router;
