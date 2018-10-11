'use strict';

const colors = require(`colors`);
const fs = require(`fs`);
const http = require(`http`);
const path = require(`path`);
const url = require(`url`);


const HOST_NAME = `127.0.0.1`;
const DEFAULT_PORT = 3000;

module.exports = {
  alias: [`--server`, `-s`],
  description: `Starts a local server on provided <port> (${DEFAULT_PORT} by default). Example: "--server -p 1488 -l"`,

  run: (...args) => {
    const port = args[args.indexOf(`-p`) + 1] || DEFAULT_PORT;
    const enableLog = args[args.indexOf(`-l`)] || false;

    const hostname = HOST_NAME;
    const MimeTypes = {
      '.ico': `image/x-icon`,
      '.html': `text/html`,
      '.js': `text/javascript`,
      '.css': `text/css`,
      '.png': `image/png`,
      '.jpg': `image/jpeg`,
      '.gif': `image/gif`,
      '.svg': `image/svg+xml`
    };

    const server = http.createServer((req, res) => {
      if (enableLog) {
        console.log(`${req.method} ${req.url}`);
      }

      const parsedUrl = url.parse(req.url);
      const sanitizedPath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, ``);
      let pathname = path.join(process.cwd(), `static`, sanitizedPath);

      fs.exists(pathname, (exists) => {
        if (!exists) {
          res.statusCode = 404;
          res.writeHead(404, `Not found.`, {'Content-Type': `text/plain`});
          res.end(`File ${pathname} not found.`);
          return;
        }

        if (fs.statSync(pathname).isDirectory()) {
          pathname += `/index.html`;
        }

        fs.readFile(pathname, (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.writeHead(500, `Internal server error.`, {'Content-Type': `text/plain`});
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
      console.log(`${colors.cyan(`Static server is up and running at http://${hostname}:${port}/`)}`);
    });
  }
};
