var express = require('express'),
    router = express.Router(),
    unirest = require('unirest'),
    path = require('path'),
    utils = require(path.join(__dirname, '..','..', 'utils.js'));

/* Submit Predictions */
router.post('/', function(req, res) {
  var _dsName = req.app.locals.dataset.name;
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/datasets/" + _dsName + "/prediction"),
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
