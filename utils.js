buildURL = function(config, path) {
  var protocol = (config.ssl) ? "https" : "http";
  return protocol + "://" + config.host + ":" + config.port + "/1.0" + path;
}

handleServerError = function(data) {
  return {
    "errorId": data.body.errorId,
    "errorMessage": data.body.errorMessage
  };
}

exports.buildURL = buildURL;
exports.handleServerError = handleServerError;
