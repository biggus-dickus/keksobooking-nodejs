'use strict';

const colors = require(`colors`);

const allCommands = require(`./all`);

const listAll = (aliasesOnly = false) => {
  if (aliasesOnly) {
    return allCommands.map((command) => command.alias)
      .reduce((res, it) => res.concat(it));
  }

  return `${allCommands
    .map((command) => colors.grey(command.alias) + ` — ` + colors.green(command.description))
    .join(`\n`)}`;
};

module.exports = listAll;
