/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../index'),
  kraken = require('kraken-js'),
  request = require('supertest'),
  assert = require('assert');


describe('index', function () {

  var mock;


  beforeEach(function (done) {
    kraken.create(app).listen(function (err, server) {
      mock = server;
      done(err);
    });
  });


  afterEach(function (done) {
    mock.close(done);
  });


  it('should say "hello"', function (done) {
    request(mock)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(/.*Hello,.*/)
      .end(function(err, res){
        done(err);
      });
  });

  it('should say error if no scrapper', function (done) {
    request(mock)
      .get('/getData')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(/.*This scrapper does not exist or have no data.*/)
      .end(function(err, res){
        done(err);
      });
  });

  it('should say error if bad scrapper', function (done) {
    request(mock)
      .get('/getData?scrapper=Google')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(/.*This scrapper does not exist or have no data.*/)
      .end(function(err, res){
        done(err);
      });
  });

  it('no error if scrapper', function (done) {
    request(mock)
      .get('/getData?scrapper=github')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(/.*"id": */)
      .end(function(err, res){
        done(err);
      });
  });

});