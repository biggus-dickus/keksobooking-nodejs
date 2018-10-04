'use strict';

module.exports = {
  getRandomIntInclusive: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  getRandomArbitrary: (min, max) => Math.random() * (max - min) + min
};
