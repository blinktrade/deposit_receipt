'use strict';

var fs = require('fs');
var path = require('path');
var multer = require('multer');
var uuid = require('node-uuid');
var request = require('request');
var querystring = require('querystring');
var format = require('util').format;
var config = require('../config/config');
var bucket = require('../config/storage');

module.exports = {
  index: function(req, res, next) {
    var form = 'form.jade';
    var deposit_method = req.query.deposit_method;

    // render additional forms methods
    fs.readdirSync(__dirname + '/views/methods')
    .forEach(function(data) {
        var method = path.basename(data, '.jade');
        if (deposit_method === method) {
            form = 'methods/' + method + '.jade';
        }
    });

    // render default form
    return res.render(form, req.query || req.body);
  },

  multer: multer({
    inMemory: true,
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    fileFilter: function(req, file, callback) {
      var filename = file.originalname.toLowerCase();
      var invalid = path.extname(filename) !== '.jpg'
          && path.extname(filename) !== '.jpeg'
          && path.extname(filename) !== '.png'
          && path.extname(filename) !== '.pdf'
          && path.extname(filename) !== '.doc'

      if (invalid) {
        req.flash('messageFileType', 'File Type not allowed!');
        callback(false)
      } else {
        callback(null, true)
      }
    }
  }),

  uploadReceipt: function(req, res, next) {
    if (!req.file) {
      req.body.messageFile = req.flash('messageFileType');
      return res.status(400).redirect('/?' + querystring.stringify(req.body))
    }

    if (req.file.size >= 5000000) {
      req.flash('messageFileSize', 'Files should be less than 5MB');
      req.body.messageFile = req.flash('messageFileSize');
      return res.status(400).redirect('/?' + querystring.stringify(req.body))
    }

    var filename = new Date().toISOString().slice(0,10).replace(/-/g,"") 
                 + '_' + req.body.deposit_method 
                 + '_' + req.body.username 
                 + '_' +  uuid.v4().split('-')[4] + path.extname(req.file.originalname);
    var blob = bucket.file(path.join(
      req.body.broker_username,
      req.body.control_number,
      '/'
    ) + filename);
    var blobStream = blob.createWriteStream();

    blobStream.on('error', function(err) {
      return res.status(400).send(err);
    });

    blobStream.on('finish', function() {
      req.blob = blob;
      return next();
    });

    blobStream.end(req.file.buffer);
  },

  webhookCallback: function(req, res, next) {

    req.body.event_id = path.basename(req.blob.name, path.extname(req.blob.name));
    req.body.depositReceipt = format(config.store_url, bucket.name, req.blob.name);

    request.post({
      url: req.body.testnet ? config.blinktrade.testnet : config.blinktrade.prod,
      form: {
        submissionID: parseInt(1e7 * Math.random(), 10),
        rawRequest: JSON.stringify(req.body)
      }
    }, function(error, response, body) {
      if (body !== '*ok*') {
        return res.status(400).send(body);
      }

      return res.status(200).render('thankyou.jade');
    });
  }
};
