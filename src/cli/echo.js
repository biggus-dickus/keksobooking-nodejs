'use strict';

const colors = require(`colors`);

const commands = [
  require(`./about`),
  require(`./help`),
  require(`./version`)
];
const throwError = require(`./unknown-command`);

const echo = () => {
  const args = process.argv.slice(2);

  if (!args[0]) {
    console.log([
      colors.random(`Hey youser!`),
      `This script will setup and run the Keksobooking server.`,
      `To view the list of available commands, type "--help".`
    ].join(`\n`));
    process.exit(0);
    return;
  }

  const userCommand = commands.find((command) => command.alias === args[0]);

  if (userCommand) {
    userCommand.run();
    process.exit(0);
    return;
  }

  throwError(args[0]);
};

module.exports = echo;
