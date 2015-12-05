var express = require('express');
var router = express.Router();
var request = require('request');

/* Get a list of existing datasets  */
router.get('/', function(req, res) {
  var options = req.app.get('neuron_configs');
  options.url = options.url + "/datasets/";

  request(options, function(error, response, body) {
    //Check for error
    if(error){
        return console.log('Error:', error);
    }
    //Check for right status code
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned:', response.statusCode);
    }
    //All is good. Print the body
    res.send(JSON.parse(body));
  });
});


module.exports = router;
