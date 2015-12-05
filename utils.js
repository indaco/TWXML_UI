buildURL = function(config, path) {
  return config.protocol + "://" + config.host + ":" + config.port + "/1.0" + path;
}

exports.buildURL = buildURL;
