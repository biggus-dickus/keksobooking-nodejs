'use strict';

const packageInfo = require(`../../package.json`);

module.exports = {
  alias: `--about`,
  description: `About the program`,
  run: () => {
    console.log([
      `Description: ${packageInfo.description}.`,
      `Author: ${packageInfo.author}.`,
      `License: ${packageInfo.license}.`
    ].join(`\n`));
  }
};
