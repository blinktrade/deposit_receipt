'use strict';

var express = require('express');

var app = express();
require('./config/express')(app);

exports = module.exports = app;
