'use strict';

const {TITLES, X_MIN, X_MAX, Y_MIN, Y_MAX, PRICE_MIN, PRICE_MAX, TYPES, ROOMS_MIN, ROOMS_MAX, TIMES, FEATURES, PHOTOS} = require(`./constraints`);
const {WEEK} = require(`./constants`);
const {getRandomIntInclusive, getRandomArbitrary} = require(`../utils/random-number`);
const getRandomString = require(`../utils/random-string`);
const shuffle = require(`../utils/shuffle-array`);

const generateEntity = () => {
  return {
    author: {
      avatar: `https://robohash.org/${getRandomString(5)}`
    },
    offer: {
      title: TITLES[Math.floor(Math.random() * TITLES.length)],
      address: `${getRandomIntInclusive(X_MIN, X_MAX)}, ${getRandomIntInclusive(Y_MIN, Y_MAX)}`,
      price: getRandomArbitrary(PRICE_MIN, PRICE_MAX),
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
      rooms: getRandomIntInclusive(ROOMS_MIN, ROOMS_MAX),
      checkin: TIMES[Math.floor(Math.random() * TIMES.length)],
      checkout: TIMES[Math.floor(Math.random() * TIMES.length)],
      features: FEATURES.slice(0, getRandomIntInclusive(1, FEATURES.length)),
      description: ``,
      photos: shuffle(PHOTOS.slice())
    },
    location: {
      x: getRandomIntInclusive(X_MIN, X_MAX),
      y: getRandomIntInclusive(Y_MIN, Y_MAX)
    },
    date: getRandomArbitrary(Date.now() - WEEK, Date.now())
  };
};

module.exports = generateEntity;
