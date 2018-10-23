'use strict';

require(`dotenv`).config();
const {MongoClient} = require(`mongodb`);

const logger = require(`../logger`);

const URL = process.env.DB_HOST || `mongodb://localhost:27017`;
const DB_NAME = process.env.DB_NAME || `keksobooking`;

// Export connection promise
module.exports = MongoClient.connect(URL, {useNewUrlParser: true})
  .then((client) => client.db(DB_NAME))
  .catch((e) => {
    logger.error(`Failed to connect to MongoDB`, e);
    process.exit(1);
  });
