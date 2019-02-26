const assert = require('assert');
const except = require('chai').except;
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

const test_secret = "testsecret";


describe('Unit testing the auth route', function() {

    it('should return OK status', function() {
      return request(app)
        .get('/')
        .then(function(response){
            assert.equal(response.status, 200)
        })
    });
});