'use strict';

const packageInfo = require(`../../../package.json`);

module.exports = {
  alias: [`--author`, `-a`],
  description: `About the program`,
  run: () => {
    console.log([
      `Description: ${packageInfo.description}.`,
      `Version: ${packageInfo.version}.`,
      `Author: ${packageInfo.author}.`,
      `License: ${packageInfo.license}.`
    ].join(`\n`));

    process.exit(0);
  }
};
