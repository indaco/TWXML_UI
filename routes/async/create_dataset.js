var express = require('express'),
    router = express.Router(),
    unirest = require('unirest'),
    path = require('path'),
    utils = require(path.join(__dirname, '..','..', 'utils.js'));

/* Create a new Dataset */
router.post('/', function(req, res) {
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/datasets/"),
    headers: req.app.locals.neuron_header,
    body: JSON.stringify(req.body)
  };

  unirest.post(options.url)
  .headers(options.headers)
  .send(options.body)
  .end(function(response) {
    if (response.error) {
      res.send({"statusCode": response.status, "error": response.error});
    }
    res.send(response.body);
  });
});

module.exports = router;
