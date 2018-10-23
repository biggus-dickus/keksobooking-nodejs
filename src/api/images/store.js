'use strict';

const mongodb = require(`mongodb`);
const connection = require(`../../database/db`);

class ImageStore {
  async getBucket() {
    if (this._bucket) {
      return this._bucket;
    }

    const db = await connection;
    if (!this._bucket) {
      this._bucket = new mongodb.GridFSBucket(db, {
        chunkSizeBytes: 512 * 1024,
        bucketName: `avatars`
      });
    }
    return this._bucket;
  }

  async get(filename) {
    const bucket = await this.getBucket();
    const results = await (bucket).find({filename}).toArray();
    const entity = results[0];
    if (!entity) {
      return void 0;
    }
    return {info: entity, stream: bucket.openDownloadStreamByName(filename)};
  }

  async save(filename, stream) {
    const bucket = await this.getBucket();
    return new Promise((resolve, reject) => {
      stream
        .pipe(bucket.openUploadStream(filename))
        .on(`error`, reject)
        .on(`finish`, resolve);
    });
  }
}

module.exports = new ImageStore();
