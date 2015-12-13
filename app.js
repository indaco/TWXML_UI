// Required NodeJS modules
// ------------------------------------------------
var express = require('express'),
    path        = require('path'),
    favicon     = require('serve-favicon'),
    logger      = require('morgan'),
    bodyParser  = require('body-parser'),
    config      = require('config'),
    helmet      = require('helmet'),
    cors        = require('cors'),
    version     = require('./version');

// Routes setup pages
// ------------------------------------------------
var home_page     = require('./routes/index'),
    learn_page    = require('./routes/learn'),
    actions_page  = require('./routes/actions'),
    glossary_page = require('./routes/glossary');


// Async Routes setup
// ------------------------------------------------
var async_version             = require('./routes/async/version'),
    async_dataset_list        = require('./routes/async/dataset_list'),
    async_create_dataset      = require('./routes/async/create_dataset'),
    async_use_dataset         = require('./routes/async/use_dataset'),
    async_delete_dataset      = require('./routes/async/delete_dataset'),
    async_configure_dataset   = require('./routes/async/configure_dataset'),
    async_submit_signals      = require('./routes/async/submit_signals'),
    async_submit_profiles     = require('./routes/async/submit_profiles'),
    async_submit_clusters     = require('./routes/async/submit_clusters'),
    async_submit_predictions  = require('./routes/async/submit_predictions'),
    async_job_status          = require('./routes/async/job_status'),
    async_job_results         = require('./routes/async/job_results');
    //async_upload_dataset      = require('./routes/async/upload_dataset');

// Express initialization
// ------------------------------------------------
var app = express();

// view engine setup
// ------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));
app.use(version);

// App Locals
// ------------------------------------------------
app.locals.neuron_config = {
  host: config.get('host'),
  port: config.get('port') || 80,
  ssl: config.get('ssl') || false,
  neuron_app_id: config.get('neuron_app_id'),
  neuron_app_key: config.get('neuron_app_key')
};
app.locals.neuron_headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'neuron-application-id': config.neuron_app_id,
  'neuron-application-key': config.neuron_app_key
};

// Sync Pages Routes
// ------------------------------------------------
app.use('/', home_page);
app.use('/learn', learn_page);
app.use('/actions', actions_page);
app.use('/glossary', glossary_page);

// Async Routes
// ------------------------------------------------
app.use('/version', async_version);
app.use('/dataset_list', async_dataset_list);
app.use('/create_dataset', async_create_dataset);
app.use('/use_dataset', async_use_dataset);
app.use('/delete_dataset', async_delete_dataset);
app.use('/configure', async_configure_dataset);
//app.use('/upload', async_upload_dataset);
app.use('/submit_signals', async_submit_signals);
app.use('/submit_profiles', async_submit_profiles);
app.use('/submit_clusters', async_submit_clusters);
app.use('/submit_predictions', async_submit_predictions);
app.use('/job_status', async_job_status);
app.use('/job_results', async_job_results);

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
  app.locals.pretty = true;
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
