/**
 * Date: 12/01/13
 * A very simple mongodb connector
 */
'use strict';
var mongoose = require('mongoose');
var logModel = function () {
//Define a super simple schema for our products.
  var mongoSchema = mongoose.Schema({
    title: String
  });
//Verbose toString method
  mongoSchema.methods.whatAmI = function () {
    var greeting = this.name ?
      'Hello, my name is ' + this.name
      : 'I don\'t have a name';
    console.log(greeting);
  };
  return mongoose.model('Product', mongoSchema);
};
module.exports = new logModel();