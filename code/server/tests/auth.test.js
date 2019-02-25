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

    it('should return status code 201', (done) => {
        const goodRequest = {
            token: testToken
        }
        request(HOST)
            .post('/auth/keys/generate')
            .send(goodRequest)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                if (err) throw err;
                assert.equal(res.body.message, true);
                done();
            })
    });
});