'use strict';

const Cursor = require(`./cursor.mock`);
const generateOffers = require(`../generator/generate-offers`);

class OffersStoreMock {
  constructor(data) {
    this.data = data;
  }

  async getOne(dateObj) {
    return this.data.find((it) => it.date === dateObj.date);
  }

  async getAll() {
    return new Cursor(this.data);
  }

  async saveOne() {
    return {
      insertedId: 42
    };
  }
}

module.exports = new OffersStoreMock(generateOffers());
