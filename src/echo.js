'use strict';

const colors = require(`colors`);

const commands = [
  require(`./cli/about`),
  require(`./cli/help`),
  require(`./cli/version`)
];

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

  const userCommand = commands.filter((command) => command.alias === args[0])[0];

  if (userCommand) {
    userCommand.run();
    process.exit(0);
    return;
  }

  console.error(`Unknown param: ${args[0]}.\n`);
  commands[1].run();
  process.exit(1);
};

module.exports = echo;
