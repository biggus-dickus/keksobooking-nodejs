'use strict';

const asyncMiddleware = require(`./async-middleware`);
const logger = require(`../../../logger`);

const getImage = (id, routerInstance) => {
  return async (req, res) => {
    const result = await routerInstance.imagesStore.get(id);
    if (!result) {
      res.status(404).send(`No file was found at ${req.url}.`);
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
  };
};


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

    const getImg = getImage(found._id, router);
    await getImg(req, res);
  }));


  // Get photo preview by post date
  router.get(`/:date/preview/:num`, asyncMiddleware(async (req, res) => {
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

    const getImg = getImage(`${found._id}_${req.params.num}`, router);
    await getImg(req, res);
  }));
};
