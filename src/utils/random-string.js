'use strict';

const getRandomString = (max) => {
  const alphaNum = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
  let result = ``;

  for (let i = 0; i < max; i++) {
    result += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
  }

  return result;
};

module.exports = getRandomString;
