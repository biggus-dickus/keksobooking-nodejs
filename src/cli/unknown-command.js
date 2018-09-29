'use strict';

const listAll = require(`./list-all`);

const onUnknownCommand = (alias) => {
  console.error([
    `Unknown param: ${alias}.`,
    `Available commands:`,
    `--help — shows help info`,
    listAll()
  ].join(`\n`));
  process.exit(1);
};

module.exports = onUnknownCommand;
