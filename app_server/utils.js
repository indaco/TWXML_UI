buildURL = function(config, path) {
  var protocol = (config.ssl) ? "https" : "http";
  return protocol + "://" + config.host + ":" + config.port + "/1.0" + path;
};

handleServerError = function(data) {
  var msg = { errorId: "", errorMessage: "" };
  if (data.body.errorId !== null && data.body.errorId !== undefined) {
    msg.errorId = data.body.errorId;
    msg.errorMessage = data.body.errorMessage;
  } else {
      msg.errorId = data.code;
      msg.errorMessage = data.body;
  }
  return msg;
};

getJobResultsURLByJobType = function(params) {
  var _url = "";
  switch (params.jobType) {
    case 'pva':
      _url = "/datasets/" + params.dsName + "/prediction/" + params.jobID + "/pva";
      break;
    default:
      _url = "/datasets/" + params.dsName + "/" + params.jobType + "/" + params.jobID + "/results";
  }
  return _url;
};

exports.buildURL = buildURL;
exports.handleServerError = handleServerError;
exports.getJobResultsURLByJobType = getJobResultsURLByJobType;
