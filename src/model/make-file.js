'use strict';

const fs = require(`fs`);

const generateEntity = require(`./entity`);
const {DEFAULT_PATH, MAX_AT_ONCE} = require(`./constants`);

const makeFile = (count = 1, path = DEFAULT_PATH) => {
  if (count > MAX_AT_ONCE) {
    throw Error(`The count param cannot exceed ${MAX_AT_ONCE}.`);
  }

  if (count <= 0) {
    throw Error(`The count param cannot be lower or equal to 0.`);
  }

  const fileWriteOptions = {encoding: `utf-8`, mode: 0o644};

  return new Promise((resolve, reject) => {
    const offers = [];
    for (let i = 0; i < count; i++) {
      offers.push(generateEntity());
    }

    fs.writeFile(path, JSON.stringify(offers), fileWriteOptions, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

module.exports = makeFile;
