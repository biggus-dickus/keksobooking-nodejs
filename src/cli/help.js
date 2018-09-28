'use strict';

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
      `--help — print this message`,
      `${commands.map(
          (command) => command.alias + ` — ` + command.description
      ).join(`\n`)}`
    ].join(`\n`));
  }
};
