var express 	= require('express'),
  	router 		= express.Router(),
  	path 			= require('path'),
  	fs 				= require('fs'),
  	multer 		= require('multer'),
  	unirest 	= require('unirest'),
  	utils 		= require(path.join(__dirname, '..', 'utils.js'));

/* GET createdataset page. */
router.get('/', function(req, res) {
  res.render('actions', { title: 'TWXMLUI :: Getting Started' });
});

/* Multer Configuration */
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dsNameFolder = path.join(__dirname, '..', 'uploads');
    cb(null, dsNameFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var _uploading = multer({ storage: _storage}); // multer initialization



/* Upload the CSV file to an existing dataset */
  router.post('/', _uploading.single('upl'), function(req, res) {
  var _dsName = req.body.upload_dsName_input;
  var _file = req.file;
  var _configs = req.app.locals.neuron_config;
  var _headers = {
    'Accept': 'application/json',
    'neuron-application-id': req.app.locals.neuron_config.neuron_app_id,
    'neuron-application-key': req.app.locals.neuron_config.neuron_app_key
  };
  var options = {
    url: utils.buildURL(_configs, "/datasets/" + _dsName + "/data"),
    headers: _headers,
  };

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
      /*console.log(response.body);
      res.render('actions', {
        title: 'Upload Dataset',
        uploadResult: "OK",
        resultStatus: response.body.message,
        resultId: response.body.resultId
      });*/
    });
});

module.exports = router;
