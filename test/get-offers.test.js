'use strict';

const assert = require(`assert`);
const request = require(`supertest`);

const app = require(`../src/cli/commands/server`).app;
const {MAX_AT_ONCE} = require(`../src/model/constants`);

describe(`GET /api/offers test suite.`, () => {
  it(`should return all offers as json array of ${MAX_AT_ONCE} elements`, async () => {
    const response = await request(app)
      .get(`/api/offers`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const offers = response.body;
    assert.strictEqual(offers.length, MAX_AT_ONCE);
  });

  it(`should return all offers when the address has trailing "/"`, async () => {
    const response = await request(app)
      .get(`/api/offers/`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const offers = response.body;
    assert.strictEqual(offers.length, MAX_AT_ONCE);
  });

  it(`should return 5 elements when the following query params are set: "skip=3&limit=8"`, async () => {
    const response = await request(app)
      .get(`/api/offers?skip=3&limit=8`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const offers = response.body;
    assert.strictEqual(offers.length, 5);
  });

  it(`should return a 400 error when query params are invalid`, async () => {
    await request(app)
      .get(`/api/offers?skip=15&limit=8`)
      .expect(400)
      .expect(`Content-Type`, /html/);
  });

  it(`should return a 404 error when no offer is found for specified date`, async () => {
    await request(app)
      .get(`/api/offers/${Date.now()}`)
      .expect(404)
      .expect(`Content-Type`, /html/);
  });

  // todo: positive test /api/offers:date (currently, the date value is never steady)

  it(`should return a 404 error when trying to obtain data from unknown resource`, async () => {
    await request(app)
      .get(`/api/ololopyschpysch`)
      .expect(404)
      .expect(`Content-Type`, /html/);
  });
});
