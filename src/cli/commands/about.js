'use strict';

const packageInfo = require(`../../../package.json`);

module.exports = {
  alias: `--author`,
  description: `About the program`,
  run: () => {
    console.log([
      `Description: ${packageInfo.description}.`,
      `Author: ${packageInfo.author}.`,
      `License: ${packageInfo.license}.`
    ].join(`\n`));
  }
};
