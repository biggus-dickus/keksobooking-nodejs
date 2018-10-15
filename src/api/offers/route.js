'use strict';

const express = require(`express`);

const generateEntity = require(`../../model/entity`);
const {MAX_AT_ONCE} = require(`../../model/constants`);


const makeOffers = (max = MAX_AT_ONCE) => {
  const offers = [];

  for (let i = 0; i < max; i++) {
    offers.push(generateEntity());
  }

  return offers;
};

const allOffers = makeOffers();
const offersRouter = new express.Router();

offersRouter.get(``, (req, res) => {
  const skip = parseInt(req.query.skip, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || MAX_AT_ONCE;

  if (skip < 0 || limit < 0 || limit > MAX_AT_ONCE) {
    res.status(400).send(`Invalid query params`);
    return;
  }

  const response = allOffers.slice(skip, skip + limit);
  res.send(response);
});

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

module.exports = offersRouter;
