'use strict';

var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var uuid = require('node-uuid');
var session = require('express-session');
var flash = require('connect-flash');
var routes = require('../app/routes');

require('./storage');

module.exports = function(app) {

  app.set('views', './app/views');
  app.set('view engine', 'jade');
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(session({
    saveUninitialized: false,
    secret: uuid.v4(),
    resave: false
  }));
  app.use(flash());
  app.use(cors({ origin: false }));
  app.disable('x-powered-by');

  app.use('/', routes(app));
  app.listen(process.env.PORT || '8080');
};
