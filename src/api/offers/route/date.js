'use strict';

const asyncMiddleware = require(`./async-middleware`);
const logger = require(`../../../logger`);


module.exports = (router) => {
  // Get offer by date
  router.get(`/:date`, asyncMiddleware(async (req, res) => {
    const date = req.params.date;

    if (!date) {
      res.status(400).send(`No date param provided`);
      return;
    }

    if (isNaN(+date)) {
      res.status(400).send(`Incorrect date format: ${date}. Must be a UNIX date.`);
      return;
    }

    const found = await router.offersStore.getOne({date: +date});
    if (!found) {
      res.status(404).send(`No offer was found with date ${date}`);
      return;
    }

    res.send(found);
  }));


  // Get avatar by post date
  router.get(`/:date/avatar`, asyncMiddleware(async (req, res) => {
    const date = req.params.date;

    if (!date) {
      res.status(400).send(`No date param provided`);
      return;
    }

    if (isNaN(+date)) {
      res.status(400).send(`Incorrect date format: ${date}. Must be a UNIX date.`);
      return;
    }

    const found = await router.offersStore.getOne({date: +date});
    if (!found) {
      res.status(404).send(`No offer was found with date ${date}`);
      return;
    }

    const result = await router.imagesStore.get(found._id);
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
};
