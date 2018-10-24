'use strict';

require(`dotenv`).config();
const {MongoClient} = require(`mongodb`);

const logger = require(`../logger`);

const {
  DB_HOST = `localhost:27017`,
  DB_NAME = `keksobooking`
} = process.env;

const url = `mongodb://${DB_HOST}`;

// Export connection promise
module.exports = MongoClient.connect(url, {useNewUrlParser: true})
  .then((client) => client.db(DB_NAME))
  .catch((e) => {
    logger.error(`Failed to connect to MongoDB`, e);
    process.exit(1);
  });
