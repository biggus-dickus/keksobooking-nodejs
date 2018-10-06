'use strict';

const {TITLES, X_MIN, X_MAX, Y_MIN, Y_MAX, PRICE_MIN, PRICE_MAX, TYPES, ROOMS_MIN, ROOMS_MAX, TIMES, FEATURES, PHOTOS} = require(`./constraints`);
const {WEEK} = require(`./constants`);

const {getRandomElement, getRandomElements, getRandomIntInclusive, getRandomIntArbitrary, getRandomString} = require(`../utils/randomizer`);
const removeDuplicates = require(`../utils/unique-array`);
const shuffle = require(`../utils/shuffle-array`);


const generateEntity = () => {
  const [coordX, coordY] = [getRandomIntInclusive(X_MIN, X_MAX), getRandomIntInclusive(Y_MIN, Y_MAX)];

  const uniqueFeatures = removeDuplicates(FEATURES);

  return {
    author: {
      avatar: `https://robohash.org/${getRandomString(5)}`
    },
    offer: {
      title: getRandomElement(TITLES),
      address: `${coordX},${coordY}`,
      price: getRandomIntArbitrary(PRICE_MIN, PRICE_MAX),
      type: getRandomElement(TYPES),
      rooms: getRandomIntInclusive(ROOMS_MIN, ROOMS_MAX),
      checkin: getRandomElement(TIMES),
      checkout: getRandomElement(TIMES),
      features: getRandomElements(uniqueFeatures, getRandomIntInclusive(1, uniqueFeatures.length)),
      description: ``,
      photos: shuffle(PHOTOS.slice())
    },
    location: {
      x: coordX,
      y: coordY
    },
    date: getRandomIntArbitrary(Date.now() - WEEK, Date.now())
  };
};

module.exports = generateEntity;
