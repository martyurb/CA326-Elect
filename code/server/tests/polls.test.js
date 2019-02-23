const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

PORT = process.env.PORT || 3000;
const HOST = `http://localhost:${PORT}`;

const polls = require('../routes/polls');
const Poll = require('../models/Poll');

describe('Unit tests for poll controller', function() {

    before((done) => {
        mongoose.connection.db.dropDatabase(() => {
            console.log("Cleaning...");
            console.log("Test database dropped");
        });
        return done();
    });
    it ('should reject requests with no token with response code 500', (done) => {
        const badRequest = {
            poll: {
                created_at: 1,
                pollid:"HkLmNoP",
                author:"1111065436",
                title:"Poll Title",
                voteType: {
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
                console.log(res.body);
                done();
            })
    });
});