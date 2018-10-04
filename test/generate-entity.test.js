'use strict';

const assert = require(`assert`);

const entity = require(`../src/model/entity`)();
const {TITLES, X_MIN, X_MAX, Y_MIN, Y_MAX, PRICE_MIN, PRICE_MAX, TYPES, ROOMS_MIN, ROOMS_MAX} = require(`../src/model/constraints`);


describe(`generateEntity() test suite.`, () => {
  describe(`The generated object:`, () => {
    it(`should contain the following props: 'author', 'offer', 'location', 'date'`, () => {
      assert.deepStrictEqual(Object.keys(entity), [`author`, `offer`, `location`, `date`]);
    });

    it(`should fetch avatars from 'robohash service'`, () => {
      assert.ok(entity.author.avatar.includes(`robohash`));
    });

    it(`the 'offer.title' prop must be one of the following: ${TITLES}`, () => {
      assert.ok(TITLES.indexOf(entity.offer.title) !== -1);
    });

    it(`the 'offer.price' must be more than ${PRICE_MIN} and less than ${PRICE_MAX}`, () => {
      assert.ok(entity.offer.price >= PRICE_MIN && entity.offer.price < PRICE_MAX);
    });

    it(`the 'offer.type' prop must be one of the following: ${TYPES}`, () => {
      assert.ok(TYPES.indexOf(entity.offer.type) !== -1);
    });

    it(`the 'offer.rooms' must be between ${ROOMS_MIN} and ${ROOMS_MAX}`, () => {
      assert.ok(entity.offer.rooms >= ROOMS_MIN && entity.offer.rooms <= ROOMS_MAX);
    });
  });
});
