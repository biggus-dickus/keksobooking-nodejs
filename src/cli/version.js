'use strict';

const packageInfo = require(`../../package.json`);

module.exports = {
  alias: `--version`,
  description: `Shows program version`,
  run: () => {
    console.log(`${packageInfo.name} v${packageInfo.version}`);
  }
};
