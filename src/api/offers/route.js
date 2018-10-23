'use strict';

const express = require(`express`);
const multer = require(`multer`);
const jsonParser = express.json();
const toStream = require(`buffer-to-stream`);
const upload = multer({storage: multer.memoryStorage()});

const {getRandomElement} = require(`../../utils/randomizer`);
const logger = require(`../../logger`);
const {MAX_AT_ONCE} = require(`../../model/constants`);
const {NAMES} = require(`../../model/constraints`);
const validate = require(`./validate`);


const offersRouter = new express.Router();

const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const toPage = async (cursor, skip = 0, limit = MAX_AT_ONCE) => {
  const packet = await cursor.skip(skip).limit(limit).toArray();

  return {
    data: packet,
    skip,
    limit,
    total: await cursor.count()
  };
};


// All offers
offersRouter.get(``, asyncMiddleware(async (req, res) => {
  const skip = parseInt(req.query.skip, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || MAX_AT_ONCE;

  if (skip < 0 || limit < 0) {
    res.status(400).send(`Invalid query params: "skip" and "limit" must be an integer not lower than 0.`);
    return;
  }

  res.send(await toPage(await offersRouter.offersStore.getAll(), skip, limit));
}));


// Offer by date
offersRouter.get(`/:date`, asyncMiddleware(async (req, res) => {
  const date = req.params.date;

  if (!date) {
    res.status(400).send(`No date param provided`);
    return;
  }

  if (isNaN(+date)) {
    res.status(400).send(`Incorrect date format: ${date}. Must be a UNIX date.`);
    return;
  }

  const found = await offersRouter.offersStore.getOne({date: +date});
  if (!found) {
    res.status(404).send(`No offer was found with date ${date}`);
    return;
  }

  res.send(found);
}));


// Get avatar by post date
offersRouter.get(`/:date/avatar`, asyncMiddleware(async (req, res) => {
  const date = req.params.date;

  if (!date) {
    res.status(400).send(`No date param provided`);
    return;
  }

  if (isNaN(+date)) {
    res.status(400).send(`Incorrect date format: ${date}. Must be a UNIX date.`);
    return;
  }

  const found = await offersRouter.offersStore.getOne({date: +date});
  if (!found) {
    res.status(404).send(`No offer was found with date ${date}`);
    return;
  }

  const result = await offersRouter.imagesStore.get(found._id);
  if (!result) {
    res.status(404).send(`No avatar was found for the offer with date ${date}`);
    return;
  }

  res.header(`Content-Type`, `image/jpg`);
  res.header(`Content-Length`, result.info.length);

  res.on(`error`, (e) => logger.error(e));
  res.on(`end`, () => res.end());
  const stream = result.stream;
  stream.on(`error`, (e) => logger.error(e));
  stream.on(`end`, () => res.end());
  stream.pipe(res);
}));


// Post an offer
offersRouter.post(``, jsonParser, upload.single(`avatar`), asyncMiddleware(async (req, res) => {
  const {body, file} = req;
  if (file) {
    body.avatar = file.originalname;
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
        avatar: `api/offers/${now}/avatar`
      },
      offer: postObj,
      location: {
        x: +address[0],
        y: +address[1]
      },
      date: now
    };
  };

  const errors = validate(body);
  if (errors.length) {
    res.status(400);
    res.json(errors);
    return;
  }

  const offer = createOffer({...body});
  const result = await offersRouter.offersStore.saveOne(offer);
  const insertedId = result.insertedId;

  if (file) {
    await offersRouter.imagesStore.save(insertedId, toStream(file.buffer));
  }

  res.send(offer);
}));


module.exports = (oStore, iStore) => {
  offersRouter.offersStore = oStore;
  offersRouter.imagesStore = iStore;
  return offersRouter;
};
