'use strict';

module.exports = (arr) => {
  const primitives = {boolean: {}, number: {}, string: {}};
  const objs = [];

  return arr.filter((item) => {
    const type = typeof item;

    if (type in primitives) {
      return (primitives[type].hasOwnProperty(item)) ? false : (primitives[type][item] = true);
    }

    return (objs.indexOf(item) >= 0) ? false : objs.push(item);
  });
};
