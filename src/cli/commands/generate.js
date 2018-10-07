'use strict';

const fs = require(`fs`);
const generateEntity = require(`../../model/entity`);


const DEFAULT_PATH = `${process.cwd()}/static/offer.json`;
const MAX_AT_ONCE = 100;

const data = generateEntity();
const fileWriteOptions = {encoding: `utf-8`, mode: 0o644};

module.exports = {
  alias: `--generate`,
  description: `Generates <count> json file(s) with accommodation offers and saves them to provided <path>. Usage: '--generate <count> <path>' (1 by default).`,

  run: (count = 1, path = DEFAULT_PATH) => {
    console.log(count, path)
    if (typeof count !== `number`) {
      throw Error(`<count> must be an integer. You provided ${typeof count}.`);
    }

    if (count <= 0 || count > MAX_AT_ONCE) {
      throw Error(`Invalid argument ${count}. Can't generate less than 0 or more than ${MAX_AT_ONCE} files at once.`);
    }

    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(data), fileWriteOptions, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }
};
