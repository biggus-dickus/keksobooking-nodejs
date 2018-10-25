'use strict';

const connection = require(`../../database/db`);
const logger = require(`../../logger`);

const setupCollection = async (name) => {
  const db = await connection;

  const collection = db.collection(name);
  collection.createIndex({date: -1}, {unique: true}); // any field which can be unique
  return collection;
};

class OffersStore {
  constructor(collection) {
    this.collection = collection;
  }

  /**
   * Get entry by its name.
   * @param {Object} name
   * @return {Promise<void>}
   */
  async getOne(name) {
    return (await this.collection).findOne(name);
  }

  async getAll() {
    return (await this.collection).find();
  }

  /**
   * Save provided entry.
   * @param {Object} data
   * @return {Promise<void>}
   */
  async saveOne(data) {
    return (await this.collection).insertOne(data);
  }

  /**
   * Save a series of entries.
   * @param {Array} data
   * @return {Promise<void>}
   */
  async saveMany(data) {
    return (await this.collection).insertMany(data);
  }
}

const collectionName = `offers`;

module.exports = new OffersStore(setupCollection(collectionName).
catch((e) => logger.error(`Failed to set up "${collectionName}" collection`, e)));
