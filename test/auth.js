/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../index'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    assert = require('assert'),
    jsdom = require("jsdom");




describe('auth', function () {
    //disable warnings due to listeners, set it back to 10 after tests !
    process.setMaxListeners(100);
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


    describe('without authentification', function(){
        it('should not be accessible', function (done) {
            request(mock)
                .get('/auth')
                .expect(302)
                .expect('Location', '/login')
                .end(function(err, res){
                    done(err);
                });
        });
    });
    var authenticatedCookie;
    var authenticatedRequest;
    describe('with authentification', function(){
        before(function(done){
            done();
        });
        it('is possible to authenticate', function (done) {
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
                            var postData = {'_csrf':window.$("#csrf").attr('value'), 'login':'admin', 'password':'rMickeyaide1986t'};
                            authenticatedRequest
                                .post('/login')
                                .set('cookie', authenticatedCookie)
                                .send(postData)
                                .expect(302)
                                .expect('Location', '/admin')
                                .end(function(err, res){
                                    done(err);
                                });
                        });
                    }
                });
        });
        it('is ko with  no scrapper', function (done) {
            authenticatedRequest
                .get('/auth')
                .set('cookie', authenticatedCookie)
                .expect(403)
                .end(function(err, res){
                    done(err);
                });
        });
        it('is ko with non existing scrapper', function (done) {
            authenticatedRequest
                .get('/auth')
                .set('cookie', authenticatedCookie)
                .expect(403)
                .end(function(err, res){
                    done(err);
                });
        });
        it('is ko with  not oauth scrapper', function (done) {
            authenticatedRequest
                .get('/auth?scrapper=github')
                .set('cookie', authenticatedCookie)
                .expect(403)
                .end(function(err, res){
                    done(err);
                });
        });
        it('is ok with good scrapper', function (done) {
            authenticatedRequest
                .get('/auth?scrapper=linkedIn')
                .set('cookie', authenticatedCookie)
                .expect(302)
                .end(function(err, res){
                    done(err);
                });
        });
        after(function(done){
           done();
        });
    });
});
