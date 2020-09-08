var express = require('express');
var router = express.Router();
var tweetParser = require('../utils/tweetParser.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // tweetParser();
  res.send('respond with a resource');
});

module.exports = router;
