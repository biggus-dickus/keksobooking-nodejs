'use strict';

const assert = require(`assert`);

const entity = require(`../src/model/entity`)();
const {TITLES, X_MIN, X_MAX, Y_MIN, Y_MAX, PRICE_MIN, PRICE_MAX, TYPES, ROOMS_MIN, ROOMS_MAX, TIMES, FEATURES, PHOTOS} = require(`../src/model/constraints`);
const {WEEK} = require(`../src/model/constants`);
const removeDuplicates = require(`../src/utils/unique-array`);


const includesAll = (haystack, arr) => arr.every((item) => haystack.includes(item));

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

describe(`generateEntity() test suite.`, () => {
  describe(`The generated object:`, () => {
    it(`should contain the following props: 'author', 'offer', 'location', 'date'`, () => {
      assert.deepStrictEqual(Object.keys(entity), [`author`, `offer`, `location`, `date`]);
    });

    it(`should fetch avatars from 'robohash' service; current avatar is: ${entity.author.avatar}`, () => {
      assert.ok(entity.author.avatar.includes(`robohash`));
    });

    it(`the 'offer.title' (${entity.offer.title}) should be one of the following: ${TITLES}`, () => {
      assert.ok(TITLES.includes(entity.offer.title));
    });

    it(`the 'offer.price' (${entity.offer.price}) should be more than ${PRICE_MIN} and less than ${PRICE_MAX}`, () => {
      assert.ok(isBetween(entity.offer.price, PRICE_MIN, PRICE_MAX, true));
    });

    it(`the 'offer.type' (${entity.offer.type}) should be one of the following: ${TYPES}`, () => {
      assert.ok(TYPES.includes(entity.offer.type));
    });

    it(`the 'offer.rooms' (${entity.offer.rooms}) should be between ${ROOMS_MIN} and ${ROOMS_MAX}`, () => {
      assert.ok(isBetween(entity.offer.rooms, ROOMS_MIN, ROOMS_MAX, true, true));
    });

    it(`the 'offer.checkin' (${entity.offer.checkin}) should be one of the following: ${TIMES}`, () => {
      assert.ok(TIMES.includes(entity.offer.checkin));
    });

    it(`the 'offer.checkout' (${entity.offer.checkout}) should be one of the following: ${TIMES}`, () => {
      assert.ok(TIMES.includes(entity.offer.checkout));
    });

    it(`the 'offer.features' (${entity.offer.features}) should contain a random number of unique items from ${FEATURES}`, () => {
      assert.ok(includesAll(FEATURES, removeDuplicates(entity.offer.features)));
    });

    it(`the 'offer.description' should be an empty string`, () => {
      assert.strictEqual(entity.offer.description, ``);
    });

    it(`the 'offer.photos' should contain the randomly shuffled items from ${PHOTOS}`, () => {
      assert.ok(includesAll(PHOTOS, removeDuplicates(entity.offer.photos)));
    });

    it(`the 'location.x' (${entity.location.x}) should be more or equal than ${X_MIN} and less or equal than ${X_MAX}`, () => {
      assert.ok(isBetween(entity.location.x, X_MIN, X_MAX, true, true));
    });

    it(`the 'location.y' (${entity.location.y}) should be more or equal than ${Y_MIN} and less or equal than ${Y_MAX}`, () => {
      assert.ok(isBetween(entity.location.y, Y_MIN, Y_MAX, true, true));
    });

    const addressMatchesLocation = () => {
      const stringCoordinates = entity.offer.address.split(`,`);
      const numCoordinates = stringCoordinates.map((it) => +it);
      assert.deepStrictEqual(numCoordinates, Object.values(entity.location));
    };

    it(`the 'offer.address' (${entity.offer.address}) should be a string of a pattern {{location.x}}, {{location.y}}, and the values should match`, addressMatchesLocation);

    it(`the 'date' should be in UNIX time between the current time and a week before`, () => {
      const weekBefore = Date.now() - WEEK;
      assert.ok(isBetween(entity.date, weekBefore, Date.now(), true));
    });
  });
});
