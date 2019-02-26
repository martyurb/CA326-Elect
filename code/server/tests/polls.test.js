const assert = require('assert');
const except = require('chai').except;
const request = require('supertest');
const app = require('../app');

const secret = "oiwerl43ksmpoq5wieurxmzcvnb9843lj3459k";

function genToken(email, id) {
    return jwt.sign({email: email, userid: id}, test_secret);
}


describe('Unit testing the poll routes', function() {

    it('should return verified token', function() {

    })
});