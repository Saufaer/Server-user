var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));//mongoose:uri - через : так как такой синтаксис у nconf

module.exports = mongoose;
