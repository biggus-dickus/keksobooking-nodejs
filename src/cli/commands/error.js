'use strict';

const colors = require(`colors`);
const listAll = require(`./list-all`);

const onUnknownCommand = (alias) => {
  console.error([
    `${colors.red(`Unknown param:`)} ${colors.cyan(alias)}.\n`,
    `Available commands:`,
    `${colors.grey([`--help`, `-h`])} — ${colors.green(`Shows help info`)}`,
    listAll()
  ].join(`\n`));
  process.exit(1);
};

module.exports = onUnknownCommand;
