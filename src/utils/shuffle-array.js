'use strict';

module.exports = (arr) => {
  const total = arr.length - 1;

  for (let i = total; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};
