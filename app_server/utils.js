buildURL = function(config, path) {
  var protocol = (config.ssl) ? "https" : "http";
  return protocol + "://" + config.host + ":" + config.port + "/1.0" + path;
};

handleServerError = function(data) {
  return {
    "errorId": data.body.errorId,
    "errorMessage": data.body.errorMessage
  };
};

getJobResultsURLByJobType = function(params) {
  var _url = "";
  switch (params.jobType) {
    default:
      _url ="/datasets/" + params.dsName + "/" + params.jobType + "/" + params.jobID + "/results";
  }
  return _url;
};

exports.buildURL = buildURL;
exports.handleServerError = handleServerError;
exports.getJobResultsURLByJobType = getJobResultsURLByJobType;