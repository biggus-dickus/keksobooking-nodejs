'use strict';

const colors = require(`colors`);
const readline = require(`readline`);

const availableCommands = [...require(`./all`)];
const help = require(`./help`);
availableCommands.push(help);

const listAll = require(`./list-all`);
const packageInfo = require(`../../../package`);


const ask = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};


module.exports = () => {
  console.log([
    `Keksobooking on NodeJS, v${packageInfo.version}. Here's what I can do:`,
    listAll(),
    colors.grey(help.alias) + ` — ` + colors.green(help.description)
  ].join(`\n`));

  const talk = async (q) => {
    const aliases = listAll(`yes, please`);
    aliases.push(...help.alias);
    const arg = await ask(q);

    if (aliases.includes(arg)) {
      console.log(colors.green(`Roger that! Starting ${arg}...`));

      const command = availableCommands.find((it) => it.alias.includes(arg));
      command.run(arg);
      return;
    }

    console.log(`${colors.red(`Dunno "${arg}"`)}. Must be one of the following: ${aliases.join(`, `)}.`);
    talk(q);
  };

  talk(`Which of the above would you like me to run?\n`);
};
