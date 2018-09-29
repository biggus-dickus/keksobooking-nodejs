'use strict';

const colors = require(`colors`);

const allCommands = [
  require(`./about`),
  require(`./version`)
];

const listAll = () => {
  return `${allCommands
    .map((command) => colors.dim(command.alias) + ` — ` + colors.green(command.description))
    .join(`\n`)}`;
};

module.exports = listAll;
