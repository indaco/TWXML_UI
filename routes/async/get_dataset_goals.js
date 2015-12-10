var express = require('express'),
    router = express.Router(),
    unirest = require('unirest'),
    path = require('path'),
    utils = require(path.join(__dirname, '..','..', 'utils.js'));

/* Get a list of objectives for an existing datasets  */
router.get('/', function(req, res) {
  var _dsName = req.query.dsName;
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/datasets/" + _dsName +"/configuration"),
    headers: req.app.locals.neuron_headers
  };

  unirest.get(options.url)
  .headers(options.headers)
  .end(function(response) {
    if (response.error) {
      res.status(400).send(utils.handleErrorMessage(response));
      return;
    }
    res.send(response.body);
  });
});


module.exports = router;
