'use strict';

const colors = require(`colors`);

const generateOffers = require(`../../../test/generator/generate-offers`);
const OffersStore = require(`../../api/offers/store`);

module.exports = {
  alias: [`--fill`, `-f`],
  description: `Fills the database with mock data. For this to work, MongoDB server and NodeJS driver must be set up first. Please refer to https://docs.mongodb.com for details.`,
  run: (count) => {
    OffersStore.saveMany(generateOffers(+count))
      .then(() => {
        console.log(`${colors.green(`Test data generated successfully.`)}`);
        process.exit(0);
      })
      .catch((e) => {
        console.error(`${colors.red(`Error generating data: ${e}`)}`);
        process.exit(1);
      });
  }
};
