'use strict';

const colors = require(`colors`);

const commands = [
  require(`./commands/about`),
  require(`./commands/generate`),
  require(`./commands/help`),
  require(`./commands/version`)
];
const throwError = require(`./commands/unknown-command`);

const echo = () => {
  const args = process.argv.slice(2);

  if (!args[0]) {
    console.log([
      colors.red(`Hey youser!`),
      `This script will setup and run the Keksobooking server.`,
      `To view the list of available commands, type "--help".`
    ].join(`\n`));
    process.exit(0);
    return;
  }

  const userCommand = commands.find((command) => command.alias === args[0]);

  if (userCommand) {
    userCommand.run()
      .catch((err) => {
        console.error(err.message);
        process.exit(1);
      });
    // process.exit(0);
    return;
  }

  throwError(args[0]);
};

module.exports = echo;
