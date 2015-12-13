var express 	= require('express'),
  	router 		= express.Router(),
  	path 			= require('path'),
  	fs 				= require('fs'),
  	multer 		= require('multer'),
  	unirest 	= require('unirest'),
  	utils 		= require(path.join(__dirname, '..', '..', 'utils.js'));

var _tmpFolder = path.join(__dirname, '..', 'tmp');
var _fileInputField = 'input_csv_file';
var _upload = multer({ dest: _tmpFolder });

/* Upload the CSV file to an existing dataset */
router.post('/', _upload.single(_fileInputField), function(req, res) {

	var _configs = req.app.locals.neuron_config;
  var _headers = {
    'Accept': 'application/json',
    'neuron-application-id': req.app.locals.neuron_config.neuron_app_id,
    'neuron-application-key': req.app.locals.neuron_config.neuron_app_key
  };
  var options = {
    url: utils.buildURL(_configs, "/datasets/" + req.body.dsName + "/data"),
    headers: _headers,
  };

  //var _file = path.join(__dirname, '..', '/tmp', req.file.originalname);
  var _file = req.file;

  unirest.post(options.url)
    .headers(options.headers)
    .stream()
    .attach('file', _file.path, {
      knownLength: _file.size
    })
    .end(function(response) {
      if (response.error) {
        res.status(400).send(utils.handleErrorMessage(response));
        return;
      }
      fs.unlink(_file.path);
      res.status(200).send(response.body);
    });
});

module.exports = router;
