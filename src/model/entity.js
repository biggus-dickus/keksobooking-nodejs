'use strict';

const {TITLES, X_MIN, X_MAX, Y_MIN, Y_MAX, PRICE_MIN, PRICE_MAX, TYPES, ROOMS_MIN, ROOMS_MAX, TIMES, FEATURES, PHOTOS, NAMES, GUESTS_MIN, GUESTS_MAX} = require(`./constraints`);
const {WEEK} = require(`./constants`);

const {getRandomElement, getRandomElements, getRandomIntInclusive, getRandomIntArbitrary, getRandomString} = require(`../utils/randomizer`);
const shuffle = require(`../utils/shuffle-array`);


const generateEntity = () => {
  const [coordX, coordY] = [getRandomIntInclusive(X_MIN, X_MAX), getRandomIntInclusive(Y_MIN, Y_MAX)];

  return {
    author: {
      avatar: `https://robohash.org/${getRandomString(5)}`,
      name: getRandomElement(NAMES)
    },
    offer: {
      title: getRandomElement(TITLES),
      address: `${coordX},${coordY}`,
      price: Math.round(getRandomIntArbitrary(PRICE_MIN, PRICE_MAX)),
      type: getRandomElement(TYPES),
      rooms: getRandomIntInclusive(ROOMS_MIN, ROOMS_MAX),
      guests: getRandomIntInclusive(GUESTS_MIN, GUESTS_MAX),
      checkin: getRandomElement(TIMES),
      checkout: getRandomElement(TIMES),
      features: getRandomElements(FEATURES, getRandomIntArbitrary(1, FEATURES.length)),
      description: ``,
      photos: shuffle(PHOTOS.slice())
    },
    location: {
      x: coordX,
      y: coordY
    },
    date: Math.floor(getRandomIntArbitrary(Date.now() - WEEK, Date.now()))
  };
};

module.exports = generateEntity;
