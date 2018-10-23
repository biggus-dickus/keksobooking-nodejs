'use strict';

const packageInfo = require(`../../package`);

const commands = [
  require(`./commands/about`),
  require(`./commands/fill`),
  require(`./commands/generate`),
  require(`./commands/help`),
  require(`./commands/server`),
  require(`./commands/version`)
];
const throwError = require(`./commands/error`);

const echo = () => {
  const args = process.argv.slice(2);

  if (!args[0]) {
    console.log([
      `Keksobooking on NodeJS, v${packageInfo.version}.`,
      `To view the list of available commands, type "--help".`
    ].join(`\n`));
    process.exit(0);
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
