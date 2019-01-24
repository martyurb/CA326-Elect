var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/auth', function(req, res, next) {
  res.render('index', { title: 'Auth' });
});

router.post('/auth/login', fuction(req, res) {
    var body = req.body,
    email = req.email,
    token = req.idToken,
    console.log(body)
    res.status(200).send('yayayay')
})


module.exports = router;
