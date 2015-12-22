var package = require('../package.json');

module.exports = function(req, res, next) {
   res.locals.appVersion = package.version;
   res.locals.appName = package.name;
   next();
};
