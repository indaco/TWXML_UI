var express = require('express');
var router = express.Router();
var unirest = require('unirest');


var options = {
  host: '10.199.70.146',
  port: 8080
};

var headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'neuron-application-id': 'neuronuser'
};


/* Get TWXML version info */
router.get('/', function(req, res) {
  unirest.get('http://' + options.host + ":" + options.port + "/1.0/about/versioninfo")
    .header(headers)
    .send()
    .end(function(response) {
      if (response.error) {
        console.error(response.error);
        return res.send(500, response.error);
      }
      console.log(response.body);
      sample = "<p>You are using ThingWorx ML version: <b>" + JSON.stringify(response.body) + "</b></p>"
      res.view({version: sample});
    });
});

module.exports = router;
