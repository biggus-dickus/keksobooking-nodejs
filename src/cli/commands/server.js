'use strict';

const colors = require(`colors`);
const express = require(`express`);
const MongoError = require(`mongodb`).MongoError;

const ImagesStore = require(`../../api/images/store`);
const OffersStore = require(`../../api/offers/store`);

const offersRouter = require(`../../api/offers/route`)(OffersStore, ImagesStore);


const app = express();

const HOST_NAME = `127.0.0.1`;
const DEFAULT_PORT = 3000;

const notFoundHandler = (req, res) => {
  res.status(404).send(`File or page was not found`);
};

const errorHandler = (err, req, res, _next) => {
  if (err) {
    console.error(err);
    if (err instanceof MongoError) {
      res.status(400).send(`DB operation error. You may retry and hope for the best.`);
      return;
    }

    res.status(err.code || 500).send(`Server has fallen into unrecoverable problem and won't stand up.`);
  }
};
const CORSHandler = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
};

app.use(express.static(`${process.cwd()}/static`));

app.use(CORSHandler);
app.use(`/api/offers`, offersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const runServer = (...args) => {
  let port = args[args.indexOf(`-p`) + 1];
  if (!port || isNaN(port) || port < 1200) {
    port = DEFAULT_PORT;
  }

  app.listen(port, () => console.log(`${colors.cyan(`Local server is up and running at http://${HOST_NAME}:${port}/`)}`));
};


module.exports = {
  alias: [`--server`, `-s`],
  description: `Starts a local server on provided <port> (${DEFAULT_PORT} by default). Example: "--server -p 1488"`,
  run: (...args) => runServer(...args)
};
