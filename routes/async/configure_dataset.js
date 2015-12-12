var express = require('express'),
    router = express.Router(),
    unirest = require('unirest'),
    path = require('path'),
    utils = require(path.join(__dirname, '..','..', 'utils.js'));

/* Configure an existing dataset */
router.post('/', function(req, res) {
  var _configs = req.app.locals.neuron_config;

  var options = {
    url: utils.buildURL(_configs, "/datasets/" + req.body.dsName  + "/configuration"),
    headers: req.app.locals.neuron_headers,
    body: req.body.fileContent
  };
  unirest.post(options.url)
  .headers(options.headers)
  .send(options.body)
  .end(function (response) {
    if (response.error) {
      res.status(400).send(utils.handleErrorMessage(response));
      return;
    }
    res.status(200).send(response.body);
  });
});

module.exports = router;
