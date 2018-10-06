'use strict';

module.exports = {
  getRandomElement: (array) => array[Math.floor(Math.random() * array.length)],

  getRandomElements(array, count) {
    const shuffled = array.slice();
    let total = array.length;
    const min = total - count;
    let temp = null;
    let i = null;

    while (total-- > min) {
      i = Math.floor((total + 1) * Math.random());
      temp = shuffled[i];
      shuffled[i] = shuffled[total];
      shuffled[total] = temp;
    }

    return shuffled.slice(min);
  },

  // The max and min are inclusive
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // The min is inclusive, and the max is exclusive
  getRandomIntArbitrary: (min, max) => Math.random() * (max - min) + min,

  getRandomString(max) {
    const alphaNum = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
    let result = ``;

    for (let i = 0; i < max; i++) {
      result += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
    }

    return result;
  }
};
