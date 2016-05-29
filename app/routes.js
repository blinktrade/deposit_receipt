'use strict';

var path = require('path');
var express = require('express');
var controller = require('./controller');
var router = express.Router();

module.exports = function(app) {

  router.route('/')
    .get(controller.index)
    .post(controller.multer.single('file'),
          controller.uploadReceipt,
          controller.webhookCallback
    );

    return router;
};
