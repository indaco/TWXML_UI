var express = require('express');
var router = express.Router();

/* GET features page. */
router.get('/', function(req, res) {
  res.render('learn', { title: 'Learn More' });
});

module.exports = router;
