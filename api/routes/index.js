var express = require('express');
var router = express.Router();

// Setup a friendly greeting for the root route.
router.get('/', function(req, res, next) {
  res.json({
    message: 'Welcome to the REST API Authentication with Express project!',
  });
});

module.exports = router;
