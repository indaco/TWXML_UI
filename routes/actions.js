var express = require('express');
var router = express.Router();

/* GET createdataset page. */
router.get('/', function(req, res) {
  res.render('actions', { title: 'TWXMLUI :: Getting Started' });
});


module.exports = router;
