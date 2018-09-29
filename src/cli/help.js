'use strict';

const listAll = require(`./list-all`);

module.exports = {
  alias: `--help`,
  description: `Shows help info`,
  run: () => {
    console.log([
      `Available commands:`,
      `--help — print this message`,
      listAll()
    ].join(`\n`));
  }
};
