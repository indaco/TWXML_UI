var express = require('express'),
    router = express.Router(),
    unirest = require('unirest'),
    path = require('path'),
    utils = require(path.join(__dirname, '..','..', 'utils.js'));

/* Get a list of existing datasets  */
router.get('/', function(req, res) {
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/datasets"),
    headers: req.app.locals.neuron_header
  };

  unirest.get(options.url)
  .headers(options.headers)
  .end(function(response) {
    if (response.error) {
      res.send({"statusCode": response.status, "error": response.error});
    }
    res.send(response.body);
  });
});


module.exports = router;
