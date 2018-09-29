'use strict';

const commands = [
  require(`./cli/about`),
  require(`./cli/help`),
  require(`./cli/version`)
];
const throwError = require(`./cli/unknown-command`);

const echo = () => {
  const args = process.argv.slice(2);

  if (!args[0]) {
    console.log([
      `Hey youser!`,
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
