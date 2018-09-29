'use strict';

const allCommands = [
  require(`./about`),
  require(`./version`)
];

const listAll = () => {
  return `${allCommands
    .map((command) => command.alias + ` — ` + command.description)
    .join(`\n`)}`;
};

module.exports = listAll;
