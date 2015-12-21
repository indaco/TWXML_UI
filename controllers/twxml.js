var unirest   = require('unirest'),
    path 			= require('path'),
    utils     = require(path.join(__dirname, '..', 'utils.js'));

module.exports.retrieveVersion = function(req, res) {
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/about/versioninfo"),
    headers: req.app.locals.neuron_headers
  };

  unirest.get(options.url)
  .headers(options.headers)
  .end(function(response) {
    if (response.error) {
      res.sendStatus(400).send(utils.handleServerError(response));
      return;
    }
    res.send(response.body);
  });
};

module.exports.datasetList = function(req, res) {
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/datasets"),
    headers: req.app.locals.neuron_headers
  };

  unirest.get(options.url)
  .headers(options.headers)
  .end(function(response) {
    if (response.error) {
      res.sendStatus(400).send(utils.handleServerError(response));
      return;
    }
    res.send(response.body);
  });
};

module.exports.datasetCreation = function(req, res) {
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/datasets/"),
    headers: req.app.locals.neuron_headers,
    body: JSON.stringify(req.body)
  };

  unirest.post(options.url)
  .headers(options.headers)
  .send(options.body)
  .end(function(response) {
    if (response.error) {
      res.sendStatus(400).send(utils.handleServerError(response));
      return;
    }
    res.send(response.body);
  });
};

module.exports.datasetConfiguration = function(req, res) {
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
      res.sendStatus(400).send(utils.handleErrorMessage(response));
      return;
    }
    res.send(response.body);
  });
};

module.exports.useDataset = function(req, res) {
  var _dsName = req.query.dsName;
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/datasets/" + _dsName + "/configuration" ),
    headers: req.app.locals.neuron_headers
  };
  unirest.get(options.url)
  .headers(options.headers)
  .end(function(response) {
    if (response.error) {
      res.sendStatus(400).send(utils.handleServerError(response));
      return;
    }
    res.send(response.body);
  });
};

module.exports.datasetDeletion = function(req, res) {
  var _dsName = req.body.dsName;
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/datasets/" + _dsName),
    headers: req.app.locals.neuron_headers
  };

  unirest.delete(options.url)
  .headers(options.headers)
  .end(function(response) {
    if (response.error) {
      res.send({"statusCode": response.status, "error": response.error});
    }
    res.send("ok");
  });
};

module.exports.submitSignals = function(req, res) {
  var _dsName = req.body.dsName;
  delete req.body.dsName; // removing dsName from the body params
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/datasets/" + _dsName + "/signals"),
    headers: req.app.locals.neuron_headers,
    body: JSON.stringify(req.body)
  };

  unirest.post(options.url)
  .headers(options.headers)
  .send(options.body)
  .end(function(response) {
    if (response.error) {
      res.sendStatus(400).send(utils.handleErrorMessage(response));
      return;
    }
    res.send(response.body);
  });
};

module.exports.submitProfiles = function(req, res) {
  var _dsName = req.body.dsName;
  delete req.body.dsName; // removing dsName from the body params
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/datasets/" + _dsName + "/profilesV2"),
    headers: req.app.locals.neuron_headers,
    body: JSON.stringify(req.body)
  };

  unirest.post(options.url)
  .headers(options.headers)
  .send(options.body)
  .end(function(response) {
    if (response.error) {
      res.sendStatus(400).send(utils.handleErrorMessage(response));
      return;
    }
    res.send(response.body);
  });
};

module.exports.submitClusters = function(req, res) {
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
      res.sendStatus(400).send(utils.handleErrorMessage(response));
      return;
    }
    res.send(response.body);
  });
};

module.exports.submitPredictions = function(req, res) {
  var _dsName = req.body.dsName;
  delete req.body.dsName; // removing dsName from the body params
  var _configs = req.app.locals.neuron_config;

  req.body.exclusions = [];
  req.body.filter = null;
  req.body.iterativeTrainingRecordSampleSize = parseInt(req.body.iterativeTrainingRecordSampleSize);
  req.body.miThreshold = parseFloat(req.body.miThreshold);
  req.body.learners = JSON.parse(req.body.learners);

  var options = {
    url: utils.buildURL(_configs, "/datasets/" + _dsName + "/prediction"),
    headers: req.app.locals.neuron_headers,
    body: req.body
  };

  unirest.post(options.url)
  .headers(options.headers)
  .send(options.body)
  .end(function(response) {
    if (response.error) {
      res.sendStatus(400).send(utils.handleErrorMessage(response));
      return;
    }
    res.send(response.body);
  });
};

module.exports.jobStatus = function(req, res) {
  var _jobID = req.query.jobID;
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, "/status/" + _jobID),
    headers: req.app.locals.neuron_headers
  };
  unirest.get(options.url)
  .headers(options.headers)
  .end(function(response) {
    if (response.error) {
      res.sendStatus(400).send(utils.handleErrorMessage(response));
      return;
    }
    res.send(response.body);
  });
};

module.exports.jobResults = function(req, res) {
  var _configs = req.app.locals.neuron_config;
  var options = {
    url: utils.buildURL(_configs, utils.getJobResultsURLByJobType(req.query)),
    headers: req.app.locals.neuron_headers
  };
  unirest.get(options.url)
  .headers(options.headers)
  .end(function(response) {
    if (response.error) {
      res.sendStatus(400).send(utils.handleErrorMessage(response));
      return;
    }
    res.send(response.body);
  });
};
