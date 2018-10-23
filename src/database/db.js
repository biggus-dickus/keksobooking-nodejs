'use strict';

const {MongoClient} = require(`mongodb`);

const URL = `mongodb://localhost:27017`;
const DB_NAME = `keksobooking`;

// Export connection promise
module.exports = MongoClient.connect(URL, {useNewUrlParser: true})
  .then((client) => client.db(DB_NAME))
  .catch((e) => {
    console.error(`Failed to connect to MongoDB`, e);
    process.exit(1);
  });
