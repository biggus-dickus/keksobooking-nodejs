'use strict';

const assert = require(`assert`);
const express = require(`express`);
const request = require(`supertest`);

const imagesStoreMock = require(`./mock/images-store.mock`);
const offersStoreMock = require(`./mock/offers-store.mock`);
const offersRoute = require(`../src/api/offers/route/index`)(offersStoreMock, imagesStoreMock);
const {MAX_AT_ONCE} = require(`../src/model/constants`);


const app = express();
app.use(`/api/offers`, offersRoute);

describe(`GET /api/offers test suite.`, () => {
  it(`Should return all offers as json array of ${MAX_AT_ONCE} elements;`, async () => {
    const response = await request(app)
      .get(`/api/offers`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const offers = response.body.data;
    assert.strictEqual(offers.length, MAX_AT_ONCE);
  });

  it(`Should return all offers when the address has trailing "/";`, async () => {
    const response = await request(app)
      .get(`/api/offers/`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const offers = response.body.data;
    assert.strictEqual(offers.length, MAX_AT_ONCE);
  });

  it(`Should return 8 elements when the following query params are set: "skip=3&limit=8";`, async () => {
    const response = await request(app)
      .get(`/api/offers?skip=3&limit=8`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const offers = response.body.data;
    assert.strictEqual(offers.length, 8);
  });

  it(`Should return the offer which post date is equal to the provided date param;`, async () => {
    const response = await request(app).get(`/api/offers?limit=3`);
    const offers = response.body.data;
    const dateQ = offers[1].date;

    const newResponse = await request(app)
      .get(`/api/offers/${dateQ}`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const offer = newResponse.body;
    assert.strictEqual(offer.date, dateQ);
  });

  it(`Should return a 400 error when query params are invalid;`, async () => {
    await request(app)
      .get(`/api/offers?skip=-1&limit=hz`)
      .expect(400)
      .expect(`Content-Type`, /html/);
  });

  it(`Should return a 400 error when no date param is specified or it is not a UNIX date;`, async () => {
    await request(app)
      .get(`/api/offers/2020-02-31`)
      .expect(400)
      .expect(`Content-Type`, /html/);
  });

  it(`Should return a 404 error when date is provided correctly, but no offer is found for this date;`, async () => {
    await request(app)
      .get(`/api/offers/${Date.now()}`)
      .expect(404)
      .expect(`Content-Type`, /html/);
  });

  it(`Should return a 404 error when trying to obtain data from unknown resource.`, async () => {
    await request(app)
      .get(`/api/ololopyschpysch`)
      .expect(404)
      .expect(`Content-Type`, /html/);
  });
});
