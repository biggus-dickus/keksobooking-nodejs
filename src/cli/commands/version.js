'use strict';

const packageInfo = require(`../../../package.json`);

module.exports = {
  alias: [`--version`, `-v`],
  description: `Shows program version`,
  run: () => {
    console.log(`${packageInfo.name} v${packageInfo.version}`);
    process.exit(0);
  }
};
