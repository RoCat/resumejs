/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../index'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    express = require('express'),
    assert = require('assert'),
    jsdom = require("jsdom"),
    path = require('path');
var config = require(path.resolve('./config/customConfig.json'));

describe('admin', function () {

    var mock;
    var authenticatedCookie;


    beforeEach(function (done) {
        kraken.create(app).listen(function (err, server) {
            mock = server;
            done(err);
        });
    });


    afterEach(function (done) {
        mock.close(done);
    });

    describe('without authentification', function(){
        it('should not be accessible', function (done) {
            request(mock)
                .get('/admin')
                .expect(302)
                .expect('Location', '/login')
                .end(function(err, res){
                    done(err);
                });
        });
    });
    var authenticatedRequest;
    describe('with authentification', function(){
        before(function(done){
            done();
        });
        it('is accessible if authenticated', function (done) {
            authenticatedRequest = request(mock);
            authenticatedRequest
                .get('/login')
                .expect(200)
                .end(function(err, res){
                    if(err){
                        done(err);
                    }else {
                        authenticatedCookie = res.headers['set-cookie'];
                        jsdom.env(res.text, ["http://code.jquery.com/jquery.js"], function(err, window){
                            var postData = {'_csrf':window.$("#csrf").attr('value'), 'login':config.admin.login, 'password':config.admin.password};
                            authenticatedRequest
                                .post('/login')
                                .set('cookie', authenticatedCookie)
                                .send(postData)
                                .expect(302)
                                .expect('Location', '/admin')
                                .end(function(err, res){
                                    authenticatedRequest
                                        .get('/admin')
                                        .set('cookie', authenticatedCookie)
                                        .expect(200)
                                        .end(function(err, res){
                                            done(err);
                                        });
                                });
                        });
                    }
                });
        });
    });

    describe('page is correctly displayed', function(){
        before(function(done){
            done();
        });
        it('is accessible if authenticated', function (done) {
            authenticatedRequest
                .get('/admin')
                .set('cookie', authenticatedCookie)
                .expect(200)
                .expect(/.*<label>Selected theme <span class="required">\*<\/span><\/label>.*/)
                .end(function(err, res){
                    done(err);
                });
        });
    });

});
