'use strict';

const assert = require(`assert`);
const express = require(`express`);
const request = require(`supertest`);

const imagesStoreMock = require(`./mock/images-store.mock`);
const offersStoreMock = require(`./mock/offers-store.mock`);
const offersRoute = require(`../src/api/offers/route`)(offersStoreMock, imagesStoreMock);

const app = express();
const {TITLE_MIN_LENGTH, TITLE_MAX_LENGTH, TYPES, PRICE_MIN, PRICE_MAX, X_MIN, X_MAX, Y_MIN, Y_MAX, ROOMS_MIN, ROOMS_MAX, FEATURES} = require(`../src/model/constraints`);

app.use(`/api/offers`, offersRoute);


const validPost = {
  name: `Pavel`,
  title: `Маленькая квартирка рядом с парком`,
  address: `570, 472`,
  description: `Маленькая чистая квартира на краю парка. Без интернета, регистрации и СМС.`,
  price: 30000,
  type: `flat`,
  rooms: 1,
  guests: 1,
  checkin: `09:00`,
  checkout: `07:00`,
  features: [`elevator`, `conditioner`],
  photos: []
};

const sendInvalidData = async (data) => {
  await request(app)
    .post(`/api/offers`)
    .send(data)
    .expect(400)
    .expect(`Content-Type`, /json/);
};

describe(`POST offers test suite.`, () => {
  it(`Should handle post requests in default (application/json) format.`, async () => {
    const response = await request(app)
      .post(`/api/offers`)
      .send(validPost)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    assert.deepEqual(response.body.offer, validPost);
  });

  it(`Should handle post requests in multipart/form-data format.`, async () => {
    const response = await request(app)
      .post(`/api/offers`)
      .field(`title`, `Маленькая квартирка рядом с парком`)
      .field(`address`, `666, 333`)
      .field(`type`, `bungalow`)
      .field(`price`, 30000)
      .field(`checkin`, `14:00`)
      .field(`checkout`, `12:00`)
      .field(`rooms`, 1)
      .attach(`avatar`, `test/fixtures/avatarrr.jpg`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    assert.strictEqual(response.body.offer.avatar, `avatarrr.jpg`);
  });

  it(`Should accept multiple image files.`, async () => {
    const response = await request(app)
      .post(`/api/offers`)
      .field(`title`, `Огромный прекрасный дворец ваще збс придложэниэ`)
      .field(`address`, `333, 222`)
      .field(`type`, `house`)
      .field(`price`, 60000)
      .field(`checkin`, `12:00`)
      .field(`checkout`, `12:00`)
      .field(`rooms`, 3)
      .attach(`preview`, `test/fixtures/photo1.jpg`)
      .attach(`preview`, `test/fixtures/photo2.jpg`)
      .attach(`preview`, `test/fixtures/photo3.jpg`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const date = response.body.date;

    assert.strictEqual(response.body.offer.photos[0], `/api/offers/${date}/preview/0`);
  });
});


describe(`POST offers validation test, suite.`, () => {
  it(`Should return a 400 error status for requests with any missing required fields.`,
      sendInvalidData.bind(null, {name: `Ben Gunn`, avatar: `xxx.jpg`}));

  it(`Should return a 400 error status for malformed post object: "title" field is not ${TITLE_MIN_LENGTH}—${TITLE_MAX_LENGTH} symbols long.`,
      sendInvalidData.bind(null, {...validPost, title: `hz`}));

  it(`Should return a 400 error status for malformed post object: "type" field can only be any of the following: ${TYPES}.`,
      sendInvalidData.bind(null, {...validPost, type: `A typical white trash shithole`}));

  it(`Should return a 400 error status for malformed post object: "price" field must be in range from ${PRICE_MIN} to ${PRICE_MAX}.`,
      sendInvalidData.bind(null, {...validPost, price: 42}));

  it(`Should return a 400 error status for malformed post object: "address" field must be a string of the following format: "X,Y", and its X/Y values must be from ${X_MIN} to ${X_MAX} for X, and from ${Y_MIN} to ${Y_MAX} for Y.`,
      sendInvalidData.bind(null, {...validPost, address: `14/88`}));

  it(`Should return a 400 error status for malformed post object: "checkin" field must be a valid 24-hour format string.`,
      sendInvalidData.bind(null, {...validPost, checkin: `00:60`}));

  it(`Should return a 400 error status for malformed post object: "checkout" field must be a valid 24-hour format string.`,
      sendInvalidData.bind(null, {...validPost, checkout: `24:00`}));

  it(`Should return a 400 error status for malformed post object: "rooms" field must be between ${ROOMS_MIN} and ${ROOMS_MAX}.`,
      sendInvalidData.bind(null, {...validPost, rooms: ROOMS_MAX + 1}));

  it(`Should return a 400 error status for malformed post object: "features" field must contain no duplicates.`,
      sendInvalidData.bind(null, {...validPost, features: [...validPost.features, validPost.features[0]]}));

  it(`Should return a 400 error status for malformed post object: "features" field can be any of: ${FEATURES}.`,
      sendInvalidData.bind(null, {...validPost, features: [...validPost.features, `Thai massage`]}));
});
