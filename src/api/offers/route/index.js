'use strict';

const express = require(`express`);

const defaultRoute = require(`./default`);
const dateRoute = require(`./date`);

const offersRouter = new express.Router();

defaultRoute(offersRouter);
dateRoute(offersRouter);


module.exports = (oStore, iStore) => {
  offersRouter.offersStore = oStore;
  offersRouter.imagesStore = iStore;
  return offersRouter;
};
