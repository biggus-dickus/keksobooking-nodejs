'use strict';

const express = require(`express`);
const multer = require(`multer`);
const jsonParser = express.json();
const upload = multer({storage: multer.memoryStorage()});

const generateEntity = require(`../../model/entity`);
const {getRandomElement} = require(`../../utils/randomizer`);
const {MAX_AT_ONCE} = require(`../../model/constants`);
const {NAMES} = require(`../../model/constraints`);
const validate = require(`./validate`);


const makeOffers = (max = MAX_AT_ONCE) => {
  const offers = [];

  for (let i = 0; i < max; i++) {
    offers.push(generateEntity());
  }

  return offers;
};

const allOffers = makeOffers();
const offersRouter = new express.Router();

// All offers
offersRouter.get(``, (req, res) => {
  const skip = parseInt(req.query.skip, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || MAX_AT_ONCE;

  if (skip < 0 || limit < 0 || limit > MAX_AT_ONCE) {
    res.status(400).send(`Invalid query params: "skip" and "limit" cannot be lower than 0, "limit" cannot be greater than ${MAX_AT_ONCE}.`);
    return;
  }

  const data = allOffers.slice(skip, skip + limit);

  const response = {
    data,
    skip,
    limit,
    total: data.length
  };

  res.send(response);
});


// Offer by date
offersRouter.get(`/:date`, (req, res) => {
  const date = req.params.date;

  if (!date) {
    res.status(400).send(`No date param provided`);
    return;
  }

  if (isNaN(+date)) {
    res.status(400).send(`Incorrect date format: {${date}}. Must be a UNIX date.`);
    return;
  }

  const found = allOffers.find((it) => it.date === +date);
  if (!found) {
    res.status(404).send(`No offer was found with date ${date}`);
    return;
  }

  res.send(found);
});


// Post an offer
offersRouter.post(``, jsonParser, upload.single(`avatar`), (req, res) => {
  const {body, file} = req;
  if (file) {
    body.avatar = file.originalname;
  }

  if (!body.name) {
    body.name = getRandomElement(NAMES);
  }

  if (req.headers[`content-type`].search(/multipart\/form-data/) !== -1
    && typeof body.features === `string`) {
    body.features = [body.features];
  }

  const createOffer = (postObj) => {
    const address = postObj.address.split(`,`);

    return {
      offer: postObj,
      location: {
        x: +address[0],
        y: +address[1]
      }
    };
  };

  const errors = validate(body);
  if (errors.length) {
    res.status(400);
    res.json(errors);
    return;
  }

  res.send(createOffer({...body}));
});

module.exports = offersRouter;
