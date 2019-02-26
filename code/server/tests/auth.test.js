const assert = require('assert');
const except = require('chai').except;
const request = require('supertest');
const app = require('../app');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');

PORT = process.env.PORT || 3000;
const HOST = `http://localhost:${PORT}`;

describe('Unit testing the auth route', function() {

    let testUser;
    let testToken;

    const secret = "oiwerl43ksmpoq5wieurxmzcvnb9843lj3459k";

    before((done) => { 
        testUser = helpers.testUser;
        testToken = jwt.sign({email: testUser.email, userid: testUser.userid}, secret);
        assert.notEqual(testUser, undefined);
        return done();
    });

    it('should return status code 201 after key generation', (done) => {
        const goodRequest = {
            token: testToken
        }
        request(HOST)
            .post('/auth/keys/generate')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(201)
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.message, true);
                done();
            })
    }).timeout(5000);
    it('should return status code 500 with faulty data', (done) => {
        const goodRequest = {
            token: "ddklasfa"
        }
        request(HOST)
            .post('/auth/keys/generate')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(500)
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.message, undefined);
                done();
            });
    });
    it('should return status code 200 if users keys are set', (done) => {
        const goodRequest = {
            token: testToken
        }
        request(HOST)
            .post('/auth/keys')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.isKeySet, true);
                done();
            })
    });
    it('should return status code 500 if user doesnt exist', (done) => {
        const goodRequest = {
            token: "lkajfla"
        }
        request(HOST)
            .post('/auth/keys')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(500)
            .end(function(err, res) {
                if (err) throw err;
                done();
            })
    });
    it('should return status code 200 if user exists when fetching account', (done) => {
        const goodRequest = {
            token: testToken
        }
        request(HOST)
            .post('/auth/account')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.email, "electprojectuser@gmail.com");
                done();
            })
    });
    it('should return status code 500 if user doesnt exists when fetching account', (done) => {
        const goodRequest = {
            token: "jlkadshfka"
        }
        request(HOST)
            .post('/auth/account')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .expect(500)
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.email, undefined);
                done();
            })
    });
});
