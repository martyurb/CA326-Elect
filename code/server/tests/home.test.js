const assert = require('assert');
const except = require('chai').except;
const request = require('supertest');
const app = require('../app');

describe('Unit testing the /home route', function() {

    it('should return OK status', function() {
      return request(app)
        .get('/')
        .then(function(response){
            assert.equal(response.status, 200)
        })
    });
});