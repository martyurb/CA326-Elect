const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

PORT = process.env.PORT || 3000;
const HOST = `http://localhost:${PORT}`;

const polls = require('../routes/polls');
const Poll = require('../models/Poll');

const helpers = require('./test-helpers');

describe('Unit tests for poll controller', function() {
    
    let testUser;
    let testPollId;
    let testToken;
    let testOption;
    let testPrivKey;
    let testPubKey;

    const secret = "oiwerl43ksmpoq5wieurxmzcvnb9843lj3459k";

    before((done) => { 
        testUser = helpers.testUser;
        testPollId = helpers.testPollId;
        testOption = helpers.testOption;
        testToken = jwt.sign({email: testUser.email, userid: testUser.userid}, secret);
        assert.notEqual(testUser, undefined);
        assert.notEqual(testPollId, undefined);
        assert.notEqual(testPollId, undefined);
        return done();
    });
    it ('should reject requests with no token with response code 500', (done) => {
        const badRequest = {
            poll: {
                title:"Poll Title",
                type: {
                    code: 1,
                    name: "Straw poll",
                },
                options:["option 1"],
                isSecure: true
            }
        };
        request(HOST)
            .post('/poll/create')
            .send(badRequest)
            .set('Accept', 'application/json')
            .expect(500)
            .end(function (err, res) {
                if (err) throw err;
                done();
            });
    });
    it('should reject requests with bad poll information with response code 500', (done) => {
        const badRequest = {
            poll: "not a poll",
            token: testToken
        };
        request(HOST)
            .post('/poll/create')
            .send(badRequest)
            .set('Accept', 'application/json')
            .expect(500)
            .end(function (err, res) {
                if (err) throw err;
                //assert.equal(res.body.message, "db error")
                done();
            });
    });
    it('should create a poll given valid poll object and token', (done) => {
        const goodRequest = {
            poll: {
                title:"Poll Title",
                type: {
                    code: 1,
                    name: "Straw poll"
                },
                options:["option 1"],
                isSecure: true
            },
            token: testToken
        };
        request(HOST)
            .post('/poll/create')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(201)
            .end(function (err, res) {
                if (err) throw err;
                done();
            });
    });
    it('should fetch a poll based on poll id and return with status 200', (done) => {
        const goodRequest = {
            pollid: testPollId,
            token: testToken
        };
        request(HOST)
            .post('/poll/fetch')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                assert.notEqual(res.body.title, undefined);
                done();
            });
    });
    it('should return status 300 if no poll found with given poll id', (done) => {
        const badRequest = {
            pollid: "AAA",
            token: testToken
        }
        request(HOST)
            .post('/poll/fetch')
            .send(badRequest)
            .set('Accept', 'application/json')
            .expect(300)
            .end(function (err, res) {
                if (err) throw err;
                done();
            })
    });
    it('should return with status code 200 and all polls associated with a given user', (done) => {
        const goodRequest = {
            token: testToken
        }
        request(HOST)
            .post('/poll/all')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                assert.equal(res.body.message, true);
                done();
            })
    });
    it('should return with response code 201 and cast a vote given the token and an option', (done) => {
        const goodRequest = {
            vote: {
                pollid: testPollId,
                option: testOption,
            },
            token: testToken
        };
        request(HOST)
            .post('/poll/cast')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(201)
            .end(function (err, res) {
                if (err) throw err;
                assert.equal(res.body.message, true);
                done();
            });
    });
    it('should return with response code 500 when casting vote with bad pollid', (done) => {
        const badRequest = {
            vote: {
                pollid: "A",
                option: testOption
            },
            token: testToken
        };
        request(HOST)
            .post('/poll/cast')
            .send(badRequest)
            .set('Accept', 'application/json')
            .expect(500)
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.message, "db error");
                done();
            });
    }).timeout(4000);
    it('should return with response code 200 when requesting a polls results with valid id', (done) => {
        const goodRequest = {
            id: testPollId
        }
        request(HOST)
            .post('/poll/result')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                assert.notEqual(res.body.grouped, undefined);
                done();
            });
    });
    it('should return with response code 404 when requesting a polls results with invalid id', (done) => {
        const badRequest = {
            id: "A"
        }
        request(HOST)
            .post('/poll/result')
            .send(badRequest)
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.message, "error");
                done();
            });
    });
    it('should return with status code 200 when checking if author of the poll can access its statistics', (done) => {
        const goodRequest = {
            token: testToken,
            pollid: testPollId
        }
        request(HOST)
            .post('/poll/can-access')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.canAccess, true);
                done();
            });
    });
    it('should return with status code 301 when checking if author of poll can access when poll not found', (done) => {
        const badRequest = {
            token: testToken,
            pollid: "A"
        };
        request(HOST)
            .post('/poll/can-access')
            .send(badRequest)
            .set('Accept', 'application/json')
            .expect(301)
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.canAccess, false);
                done();
            });
    });
    it('should return with status code 200 when requesting entire poll with valid body data', (done) => {
        const goodRequest = {
            token: testToken,
            pollid: testPollId
        };
        request(HOST)
            .post('/poll/get-poll')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.message, true);
                assert.notEqual(res.body.poll, undefined);
                done();
            });
    });
    it('should return with status code 201 when requesting entire poll with invalid body data', (done) => {
        const badRequest = {
            token: testToken,
            pollid: "A"
        };
        request(HOST)
            .post('/poll/get-poll')
            .send(badRequest)
            .set('Accept', 'application/json')
            .expect(301)
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.message, false);
                assert.equal(res.body.poll, undefined);
                done();
            });
    });
    it('should return with status code 200 when requesting all of a polls votes with valid data', (done) => {
        const goodRequest = {
            token: testToken,
            pollid: testPollId
        };
        request(HOST)
            .post('/poll/get-votes')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.message, true);
                assert.notEqual(res.body.votes, undefined);
                done();
            });
    });
});
