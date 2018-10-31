'use strict';

const logger = require(`../../logger`);

const generateOffers = require(`../../../test/generator/generate-offers`);
const {MAX_AT_ONCE} = require(`../../model/constants`);
const OffersStore = require(`../../api/offers/store`);

module.exports = {
  alias: [`--fill`, `-f`],
  description: `Fills the database with <count> mock data offers (up to ${MAX_AT_ONCE}). For this to work, MongoDB server and NodeJS driver must be set up first. Please refer to https://docs.mongodb.com for details.`,
  run: (count = MAX_AT_ONCE) => {
    OffersStore.saveMany(generateOffers(+count))
      .then(() => {
        logger.info(`Test data generated successfully.`);
        process.exit(0);
      })
      .catch((e) => {
        logger.error(`Error generating data: ${e}`);
        process.exit(1);
      });
  }
};
