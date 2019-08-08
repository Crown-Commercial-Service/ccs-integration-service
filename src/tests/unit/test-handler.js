'use strict';

const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
var event = {},
  context;

describe('Tests users', function() {
  it('verifies successful response - array of users', async () => {
    const result = await app.lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);

    let response = JSON.parse(result.body);

    expect(response).to.be.an('array');
  });
});
