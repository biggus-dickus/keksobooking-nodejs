'use strict';

const colors = require(`colors`);
const http = require(`http`);

const DEFAULT_PORT = 3000;

module.exports = {
  alias: [`--server`, `-s`],
  description: `Starts a local server on provided <port> (${DEFAULT_PORT} by default).`,

  run: (port = DEFAULT_PORT) => {
    const hostname = `127.0.0.1`;

    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader(`Content-Type`, `text/html`);
      res.end(`<h1>Hello World!</h1>`);
    });

    server.listen(port, hostname, () => {
      console.log(`${colors.cyan(`Server is up and running at http://${hostname}:${port}/`)}`);
    });
  }
};
