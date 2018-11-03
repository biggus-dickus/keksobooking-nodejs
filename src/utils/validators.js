'use strict';

const {X_MIN, X_MAX, Y_MIN, Y_MAX, ALLOWED_IMAGES} = require(`../model/constraints`);


const isBetween = (value, min, max, eqMin = false, eqMax = false) => {
  if (eqMin && eqMax) {
    return value >= min && value <= max;
  }
  if (eqMin) {
    return value >= min && value < max;
  }
  if (eqMax) {
    return value > min && value <= max;
  }

  return value > min && value < max;
};

const isOneOf = (value, arr) => arr.includes(value);


module.exports = {
  isEmpty: (val) => !val || val === undefined || val === ``,

  isString: (val) => typeof val === `string`,

  isBetween,

  isOneOf,

  includesAll: (arr, haystack) => arr.every((item) => haystack.includes(item)),

  isValidTime: (val) => { // 00:00 - 23:59
    const time = val.split(`:`);
    const [hours, minutes] = time;

    const isValidFormat = time.length === 2;
    const isValidHours = isBetween(parseInt(hours, 10), 0, 23, true);
    const isValidMinutes = isBetween(parseInt(minutes, 10), 0, 60, true);

    return isValidFormat && isValidHours && isValidMinutes;
  },

  isValidAddress: (val) => { // 300, 500
    const address = val.split(`,`);
    const [x, y] = address;

    const isValidFormat = address.length === 2;
    const isValidX = isBetween(parseInt(x, 10), X_MIN, X_MAX, true, true);
    const isValidY = isBetween(parseInt(y, 10), Y_MIN, Y_MAX, true, true);

    return isValidFormat && isValidX && isValidY;
  },

  hasDuplicates: (arr) => (new Set(arr)).size !== arr.length,

  isAcceptedImgType: (fileName) => {
    const ext = fileName.split(`.`)[1].toLowerCase();
    return isOneOf(ext, ALLOWED_IMAGES);
  }
};
