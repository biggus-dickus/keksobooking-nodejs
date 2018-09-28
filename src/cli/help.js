'use strict';

const colors = require(`colors`);

const commands = [
  require(`./about`),
  require(`./version`)
];

module.exports = {
  alias: `--help`,
  description: `Shows help info`,
  run: () => {
    console.log([
      `Available commands:`,
      `${colors.dim(`--help`)} — ${colors.green(`print this message`)}`,
      `${commands.map((command) => colors.dim(command.alias) + ` — ` + colors.green(command.description)).join(`\n`)}`
    ].join(`\n`));
  }
};
