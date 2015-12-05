var express = require('express'),
    router = express.Router(),
    unirest = require('unirest'),
    utils = require('../utils.js');

/* Get TWXML version info */
router.get('/', function(req, res) {
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/about/versioninfo"),
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
