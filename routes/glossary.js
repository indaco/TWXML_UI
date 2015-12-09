var express = require('express');
var router = express.Router();

/* GET glossary page. */
router.get('/', function(req, res) {
  var obj = require('../public/glossary_dictionary.json');
  res.render('glossary', { title: 'TWXMLUI :: Glossary', pageData: {name : obj }});
});

module.exports = router;
