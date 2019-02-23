const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

PORT = process.env.PORT || 3000;
const HOST = `http://localhost:${PORT}`;

const polls = require('../routes/polls');
const Poll = require('../models/Poll');

const helpers = require('./test-helpers');

describe('Unit tests for poll controller', function() {
    let testUser;
    before((done) => { 
        testUser = helpers.testUser;
        console.log("testUser");
        assert.notEqual(testUser, undefined);
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
            })
    });
    it('should reject requests with bad poll information with response code 500', (done) => {
        const badRequest = {
            poll: "not a poll",
            token: testUser.token
        };
        request(HOST)
            .post('/poll/create')
            .send(badRequest)
            .set('Accept', 'application/json')
            .expect(500)
            .end(function (err, res) {
                if (err) throw err;
                assert.equal(res.body.message, "db error")
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
            token: testUser.token
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
});