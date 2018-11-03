'use strict';

const commands = [...require(`./commands/all`)];
commands.push(require(`./commands/help`));

const runWithNoArgs = require(`./commands/default`);
const throwError = require(`./commands/error`);

const echo = () => {
  const args = process.argv.slice(2);

  if (!args[0]) {
    runWithNoArgs();
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
