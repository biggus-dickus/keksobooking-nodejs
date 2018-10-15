'use strict';

const assert = require(`assert`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const fsaccess = promisify(fs.access);
const fsunlink = promisify(fs.unlink);

const makeFile = require(`../src/model/make-file`);
const {MAX_AT_ONCE} = require(`../src/model/constants`);

describe(`Generate file test suite.`, () => {
  it(`Should create a new file in "tmp" catalogue of project root`, () => {
    const testFileName = `${process.cwd()}/tmp/test-offers.json`;
    return makeFile(1, testFileName)
      .then(fsaccess(testFileName))
      .then(fsunlink(testFileName))
      .catch((err) => assert.fail(err.message));
  });

  it(`Should exit with an error if the provided catalogue has no write access.`, () => {
    const testPath = `/var/tmp/test-offers.json`;
    return makeFile(1, testPath)
      .then(() => assert.fail(`The "${testPath}" path must be inaccessible!`))
      .catch((err) => assert.ok(err));
  });

  it(`Should throw an error if the provided offers count exceeds ${MAX_AT_ONCE}`, () => {
    assert.throws(() => makeFile(MAX_AT_ONCE + 1));
  });

  it(`Should throw an error if the provided offers count <= 0`, () => {
    assert.throws(() => makeFile(-1));
  });
});
