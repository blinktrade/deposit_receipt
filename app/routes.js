'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var controller = require('./controller');
var router = express.Router();

module.exports = function(app) {

  router.route('/')
    .get(function(req, res){
      var form = 'form.jade';
      var deposit_method = req.query.deposit_method;

      // render additional forms methods
      fs.readdirSync(__dirname + '/views/methods')
        .forEach(function(data) {
        var method = path.basename(data, '.jade');
        if (deposit_method === method) {
          form = 'methods/'+method+'.jade';
        }
      });

      // render default form
      return res.render(form, req.query);
    });

    router.route('/upload')
    .post(app.multer.single('file'),
          controller.uploadReceipt,
          controller.webhookCallback
    );

    return router;
};
