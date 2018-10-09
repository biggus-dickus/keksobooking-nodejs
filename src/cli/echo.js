'use strict';

const commands = [
  require(`./commands/about`),
  require(`./commands/generate`),
  require(`./commands/help`),
  require(`./commands/server`),
  require(`./commands/version`)
];
const throwError = require(`./commands/error`);

const echo = () => {
  const args = process.argv.slice(2);

  if (!args[0]) {
    commands.find((command) => command.alias.includes(`--generate`)).run();
    return;
  }

  const userCommand = commands.find((command) => command.alias.includes(args[0]));

  if (userCommand) {
    userCommand.run(...args.slice(1));
    return;
  }

  throwError(args[0]);
};

module.exports = echo;
