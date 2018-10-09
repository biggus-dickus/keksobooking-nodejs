'use strict';

const colors = require(`colors`);
const listAll = require(`./list-all`);

module.exports = {
  alias: [`--help`, `-h`],
  description: `Shows help info`,
  run: () => {
    console.log([
      `Available commands:`,
      `${colors.grey(`--help`)} — ${colors.green(`print this message`)}`,
      listAll()
    ].join(`\n`));

    process.exit(0);
  }
};
