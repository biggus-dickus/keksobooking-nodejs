'use strict';

const express = require(`express`);
const jsonParser = express.json();
const multer = require(`multer`);
const toStream = require(`buffer-to-stream`);
const upload = multer({storage: multer.memoryStorage()});

const asyncMiddleware = require(`./async-middleware`);
const {getRandomElement} = require(`../../../utils/randomizer`);
const {MAX_AT_ONCE} = require(`../../../model/constants`);
const {NAMES} = require(`../../../model/constraints`);
const validate = require(`../validate`);


const toPage = async (cursor, skip = 0, limit = MAX_AT_ONCE) => {
  const packet = await cursor.skip(skip).limit(limit).toArray();

  return {
    data: packet,
    skip,
    limit,
    total: await cursor.count(),
  };
};


module.exports = (router) => {
  // Get all offers
  router.get(``, asyncMiddleware(async (req, res) => {
    const skip = parseInt(req.query.skip, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || MAX_AT_ONCE;

    if (skip < 0 || limit < 0) {
      res.status(400).send(`Invalid query params: "skip" and "limit" must be an integer not lower than 0.`);
      return;
    }

    res.send(await toPage(await router.offersStore.getAll(), skip, limit));
  }));

  // Post an offer
  router.post(``, jsonParser, upload.single(`avatar`), asyncMiddleware(async (req, res) => {
    const {body, file} = req;
    if (file) {
      body.avatar = file.originalname;
    }

    if (!body.photos) {
      body.photos = [];
    }

    if (req.headers[`content-type`].search(/multipart\/form-data/) !== -1
      && typeof body.features === `string`) {
      body.features = [body.features];
    }

    const createOffer = (postObj) => {
      const address = postObj.address.split(`,`);
      const now = Date.now();

      return {
        author: {
          name: postObj.name || getRandomElement(NAMES),
          avatar: `api/offers/${now}/avatar`,
        },
        offer: postObj,
        location: {
          x: +address[0],
          y: +address[1],
        },
        date: now,
      };
    };

    const errors = validate(body);
    if (errors.length) {
      res.status(400);
      res.json(errors);
      return;
    }

    const offer = createOffer({...body});
    const result = await router.offersStore.saveOne(offer);
    const insertedId = result.insertedId;

    if (file) {
      await router.imagesStore.save(insertedId, toStream(file.buffer));
    }

    res.send(offer);
  }));
};
