'use strict';

const express = require(`express`);

const generateEntity = require(`../../model/entity`);
const IllegalArgumentError = require(`../error/illegal-argument`);
const NotFoundError = require(`../error/not-found`);
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

  if (skip < 0 || limit < 0 || skip >= limit || limit > MAX_AT_ONCE || skip > MAX_AT_ONCE) {
    throw new IllegalArgumentError(`Invalid query params.`);
  }

  const response = allOffers.slice(skip, limit);
  res.send(response);
});

offersRouter.get(`/:date`, (req, res) => {
  const date = req.params.date;

  if (!date) {
    throw new IllegalArgumentError(`No date param provided`);
  }

  if (isNaN(+date)) {
    throw new IllegalArgumentError(`Incorrect date format: {${date}}. Must be a UNIX date.`);
  }

  const found = allOffers.find((it) => it.date === +date);
  if (!found) {
    throw new NotFoundError(`No offer was found with date ${date}`);
  }

  res.send(found);
});

module.exports = offersRouter;
