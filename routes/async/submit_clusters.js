var express = require('express'),
    router = express.Router(),
    unirest = require('unirest'),
    path = require('path'),
    utils = require(path.join(__dirname, '..','..', 'utils.js'));

/* Submit Clusters */
router.post('/', function(req, res) {
  var _dsName = req.body.dsName;
  delete req.body.dsName; // removing dsName from the body params
  req.body.hierarchy = new Array(req.body.hierarchy); // put value in an Array

  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/datasets/" + _dsName + "/clusters"),
    headers: req.app.locals.neuron_headers,
    body: JSON.stringify(req.body)
  };
  
  unirest.post(options.url)
  .headers(options.headers)
  .send(options.body)
  .end(function(response) {
    if (response.error) {
      res.status(400).send(utils.handleErrorMessage(response));
      return;
    }
    res.send(response.body);
  });
});

module.exports = router;
