'use strict';

const colors = require(`colors`);
const express = require(`express`);

const offersRouter = require(`../../api/offers/route`);


const app = express();

const HOST_NAME = `127.0.0.1`;
const DEFAULT_PORT = 3000;

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`File or page was not found`);
};
const ERROR_HANDLER = (err, req, res, _next) => {
  if (err) {
    console.error(err);
    res.status(err.code || 500).send(err.message);
  }
};

app.use(express.static(`${process.cwd()}/static`));

app.use(`/api/offers`, offersRouter);

app.use(NOT_FOUND_HANDLER);
app.use(ERROR_HANDLER);

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
  run: (port) => runServer(port),
  app
};
