'use strict';

const assert = require(`assert`);
const request = require(`supertest`);

const app = require(`../src/cli/commands/server`).app;

describe(`Post offers test suite.`, () => {
  it(`Should handle post requests in default (application/json) format.`, async () => {
    const data = {
      author: {name: `Ben Gunn`, avatar: `xxx.jpg`}
    };

    const response = await request(app)
      .post(`/api/offers`)
      .send(data)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    assert.deepEqual(response.body, data);
  });

  it(`Should handle post requests in multipart/form-data format.`, async () => {
    const authorName = `Pinus Nigra`;

    const response = await request(app)
      .post(`/api/offers`)
      .field(`name`, authorName)
      .attach(`avatar`, `test/fixtures/avatarrr.jpg`)
      .set(`Accept`, `application/json`)
      .set(`Content-Type`, `multipart/form-data`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    assert.deepEqual(response.body, {name: authorName, avatar: `avatarrr.jpg`});
  });
});
