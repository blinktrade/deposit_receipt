'use strict';

var path = require('path');
var uuid = require('node-uuid');
var request = require('request');
var format = require('util').format;
var config = require('../config/config');
var bucket = require('../config/storage');

module.exports = {
  uploadReceipt: function(req, res, next) {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    var filename = uuid.v4().split('-')[4] + path.extname(req.file.originalname);
    var blob = bucket.file(filename);
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

  webhookCallback: function (req, res) {

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
