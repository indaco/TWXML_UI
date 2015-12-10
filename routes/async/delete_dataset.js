var express = require('express'),
    router = express.Router(),
    unirest = require('unirest'),
    path = require('path'),
    utils = require(path.join(__dirname, '..','..', 'utils.js'));

/* Get a list of existing datasets  */
router.delete('/', function(req, res) {
  var _dsName = req.body.dsName;
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/datasets/" + _dsName),
    headers: req.app.locals.neuron_header
  };

  unirest.delete(options.url)
  .headers(options.headers)
  .end(function(response) {
    if (response.error) {
      res.send({"statusCode": response.status, "error": response.error});
    }
    res.send("ok");
  });
});


module.exports = router;
