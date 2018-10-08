'use strict';

const colors = require(`colors`);

const packageInfo = require(`../../../package.json`);

module.exports = {
  alias: [`--version`, `-v`],
  description: `Shows program version`,
  run: () => {
    const version = packageInfo.version.split(`.`);
    version[0] = colors.red(version[0]);
    version[1] = colors.green(version[1]);
    version[2] = colors.blue(version[2]);

    console.log(`${packageInfo.name} v${version.join(`.`)}`);
    process.exit(0);
  }
};
