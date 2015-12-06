// Required NodeJS modules
// ------------------------------------------------
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('config'),
    helmet = require('helmet'),
    cors = require('cors');

// Routes setup pages
// ------------------------------------------------
var home_page = require('./routes/index'),
    learn_page = require('./routes/learn'),
    actions_page = require('./routes/actions'),
    glossary_page = require('./routes/glossary');


// Async Routes setup
// ------------------------------------------------
var async_version = require('./routes/async_version'),
    async_dataset_list = require('./routes/async_dataset_list'),
    async_create_dataset = require('./routes/async_create_dataset'),
    async_delete_dataset = require('./routes/async_delete_dataset');
var app = express();

// view engine setup
// ------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

// App Locals
// ------------------------------------------------
app.locals.pretty = true;
app.locals.neuron_config = {
  protocol: config.get('protocol'),
  host: config.get('host'),
  port: config.get('port') || 80,
  neuron_app_id: config.get('neuron_app_id')
};
app.locals.neuron_header = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'neuron-application-id': config.neuron_app_id
};

// Pages Routes
app.use('/', home_page);
app.use('/learn', learn_page);
app.use('/actions', actions_page);
app.use('/glossary', glossary_page);
// Async Routes
app.use('/version', async_version);
app.use('/dataset_list', async_dataset_list);
app.use('/create_dataset', async_create_dataset);
app.use('/delete_dataset', async_delete_dataset);

// Error handlers
// ------------------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
