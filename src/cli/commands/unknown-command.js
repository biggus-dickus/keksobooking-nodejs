'use strict';

const colors = require(`colors`);
const listAll = require(`./list-all`);

const onUnknownCommand = (alias) => {
  console.error([
    `Unknown param: ${colors.cyan(alias)}.`,
    `Available commands:`,
    `${colors.grey(`--help`)} — ${colors.green(`show help info`)}`,
    listAll()
  ].join(`\n`));
  process.exit(1);
};

module.exports = onUnknownCommand;
