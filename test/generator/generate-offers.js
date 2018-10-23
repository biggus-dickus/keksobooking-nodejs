'use strict';

const generateEntity = require(`../../src/model/entity`);
const {MAX_AT_ONCE} = require(`../../src/model/constants`);

module.exports = (max = MAX_AT_ONCE) => {
  if (max < 1 || max > MAX_AT_ONCE) {
    throw Error(`Offers count cannot be less than 1 and more than ${MAX_AT_ONCE}`);
  }

  const offers = [];

  for (let i = 0; i < max; i++) {
    offers.push(generateEntity());
  }

  return offers;
};
