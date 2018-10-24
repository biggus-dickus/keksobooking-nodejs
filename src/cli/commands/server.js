'use strict';

require(`dotenv`).config();

const express = require(`express`);
const MongoError = require(`mongodb`).MongoError;

const logger = require(`../../logger`);

const ImagesStore = require(`../../api/images/store`);
const OffersStore = require(`../../api/offers/store`);
const offersRouter = require(`../../api/offers/route/index`)(OffersStore, ImagesStore);


const app = express();

const {
  SERVER_PORT = 3000,
  SERVER_HOST = `localhost`
} = process.env;

const notFoundHandler = (req, res) => {
  res.status(404).send(`File or page was not found.`);
};

const errorHandler = (err, req, res, _next) => {
  if (err) {
    logger.error(err);
    if (err instanceof MongoError) {
      res.status(400).send(`DB operation error. You may retry and hope for the best.`);
      return;
    }

    res.status(err.code || 500).send(`Server has fallen into unrecoverable problem and won't stand up.`);
  }
};

const CORSHandler = (req, res, _next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  _next();
};

app.use(express.static(`${process.cwd()}/static`));

app.use(CORSHandler);
app.use(`/api/offers`, offersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const runServer = (...args) => {
  let port = args[args.indexOf(`-p`) + 1];
  if (!port || isNaN(port) || port < 1200) {
    port = SERVER_PORT;
  }

  app.listen(port, () => logger.info(`Local server is up and running at http://${SERVER_HOST}:${port}/`));
};


module.exports = {
  alias: [`--server`, `-s`],
  description: `Starts a local server on provided <port> (${SERVER_PORT} by default). Example: "--server -p 1488"`,
  run: (...args) => runServer(...args)
};
