'use strict';

const assert = require(`assert`);

const entity = require(`../src/model/entity`)();
const {TITLES, X_MIN, X_MAX, Y_MIN, Y_MAX, PRICE_MIN, PRICE_MAX, TYPES, ROOMS_MIN, ROOMS_MAX, TIMES, FEATURES, PHOTOS} = require(`../src/model/constraints`);
const {WEEK} = require(`../src/model/constants`);

const containsAll = (haystack, arr) => arr.every((item) => haystack.indexOf(item) >= 0);

describe(`generateEntity() test suite.`, () => {
  describe(`The generated object:`, () => {
    it(`should contain the following props: 'author', 'offer', 'location', 'date'`, () => {
      assert.deepStrictEqual(Object.keys(entity), [`author`, `offer`, `location`, `date`]);
    });

    it(`should fetch avatars from 'robohash' service`, () => {
      assert.ok(entity.author.avatar.includes(`robohash`));
    });

    it(`the 'offer.title' should be one of the following: ${TITLES}`, () => {
      assert.ok(TITLES.indexOf(entity.offer.title) !== -1);
    });

    it(`the 'offer.price' should be more than ${PRICE_MIN} and less than ${PRICE_MAX}`, () => {
      assert.ok(entity.offer.price >= PRICE_MIN && entity.offer.price < PRICE_MAX);
    });

    it(`the 'offer.type' should be one of the following: ${TYPES}`, () => {
      assert.ok(TYPES.indexOf(entity.offer.type) !== -1);
    });

    it(`the 'offer.rooms' should be between ${ROOMS_MIN} and ${ROOMS_MAX}`, () => {
      assert.ok(entity.offer.rooms >= ROOMS_MIN && entity.offer.rooms <= ROOMS_MAX);
    });

    it(`the 'offer.checkin' should be one of the following: ${TIMES}`, () => {
      assert.ok(TIMES.includes(entity.offer.checkin));
    });

    it(`the 'offer.checkout' should be one of the following: ${TIMES}`, () => {
      assert.ok(TIMES.includes(entity.offer.checkout));
    });

    it(`the 'offer.features' should contain a random number of unique items from ${FEATURES}`, () => {
      assert.ok(containsAll(FEATURES, entity.offer.features));
    });

    it(`the 'offer.description' should be an empty string`, () => {
      assert.ok(entity.offer.description === ``);
    });

    it(`the 'offer.photos' should contain the randomly shuffled items from ${PHOTOS}`, () => {
      assert.ok(containsAll(PHOTOS, entity.offer.photos));
    });

    it(`the 'location.x' should be more or equal than ${X_MIN} and less or equal than ${X_MAX}`, () => {
      assert.ok(entity.location.x >= X_MIN && entity.location.x <= X_MAX);
    });

    it(`the 'location.y' should be more or equal than ${Y_MIN} and less or equal than ${Y_MAX}`, () => {
      assert.ok(entity.location.y >= Y_MIN && entity.location.y <= Y_MAX);
    });

    it(`the 'date' must be in UNIX time between the current time and a week before`, () => {
      assert.ok(entity.date >= Date.now() - WEEK && entity.date < Date.now());
    });
  });
});
