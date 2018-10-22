'use strict';

const {MongoClient} = require(`mongodb`);

const url = `mongodb://localhost:27017`;
const dbName = `keksobooking`;

// Export connection promise
module.exports = MongoClient.connect(url, {useNewUrlParser: true})
  .then((client) => client.db(dbName))
  .catch((e) => {
    console.error(`Failed to connect to MongoDB`, e);
    process.exit(1);
  });
