buildURL = function(config, path) {
  var protocol = (config.ssl) ? "https" : "http";
  return protocol + "://" + config.host + ":" + config.port + "/1.0" + path;
}

handleServerError = function(data) {
  return {
    "errorId": data.responseText.errorId,
    "errorMessage": data.responseText.errorMessage
  };
}

exports.buildURL = buildURL;
exports.handleServerError = handleServerError;
