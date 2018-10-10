'use strict';

const colors = require(`colors`);
const fs = require(`fs`);
const http = require(`http`);
const path = require(`path`);
const url = require(`url`);


const DEFAULT_PORT = 3000;

module.exports = {
  alias: [`--server`, `-s`],
  description: `Starts a local server on provided <port> (${DEFAULT_PORT} by default).`,

  run: (port = DEFAULT_PORT, enableLog = false) => {
    const hostname = `127.0.0.1`;
    const MimeTypes = {
      '.ico': `image/x-icon`,
      '.html': `text/html`,
      '.js': `text/javascript`,
      '.css': `text/css`,
      '.png': `image/png`,
      '.jpg': `image/jpeg`,
      '.svg': `image/svg+xml`
    };

    const server = http.createServer((req, res) => {
      if (enableLog) {
        console.log(`${req.method} ${req.url}`);
      }

      const parsedUrl = url.parse(req.url);
      const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, ``);
      let pathname = path.join(process.cwd(), `static`, sanitizePath);

      fs.exists(pathname, (exists) => {
        if (!exists) {
          res.statusCode = 404;
          res.end(`File ${pathname} not found.`);
          return;
        }

        if (fs.statSync(pathname).isDirectory()) {
          pathname += `/index.html`;
        }

        fs.readFile(pathname, (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.end(`Error getting file: ${err}.`);
            return;
          }

          const ext = path.parse(pathname).ext;
          res.setHeader(`Content-type`, MimeTypes[ext] || `text/plain`);
          res.end(data);
        });
      });
    });

    server.listen(port, hostname, () => {
      console.log(`${colors.cyan(`Server is up and running at http://${hostname}:${port}/`)}`);
    });
  }
};
