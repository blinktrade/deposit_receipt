'use strict';

var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
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
  app.use(cors({ origin: false }));
  app.disable('x-powered-by');

  // Multer is required to process file uploads and make them available via
  // req.files.
  var multer = require('multer')({
    inMemory: true,
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    fileFilter: function(req, file, callback) {
      var filename = file.originalname.toLowerCase();
      return path.extname(filename) !== '.jpg'
          && path.extname(filename) !== '.jpeg'
          && path.extname(filename) !== '.png'
          && path.extname(filename) !== '.pdf'
          && path.extname(filename) !== '.doc'
            ? callback('File not allowed', false)
            : callback(null, true);
    }
  });

  app.multer = multer;
  app.use('/', routes(app));

  app.listen(process.env.PORT || '8080');
};
