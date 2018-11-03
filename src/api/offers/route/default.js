'use strict';

const express = require(`express`);
const jsonParser = express.json();
const multer = require(`multer`);
const toStream = require(`buffer-to-stream`);
const upload = multer({storage: multer.memoryStorage()});

const asyncMiddleware = require(`./async-middleware`);
const {getRandomElement} = require(`../../../utils/randomizer`);
const {MAX_AT_ONCE} = require(`../../../model/constants`);
const {NAMES} = require(`../../../model/constraints`);
const validate = require(`../validate`);


const toPage = async (cursor, skip = 0, limit = MAX_AT_ONCE) => {
  const packet = await cursor.skip(skip).limit(limit).toArray();

  return {
    data: packet,
    skip,
    limit,
    total: await cursor.count(),
  };
};


module.exports = (router) => {
  // Get all offers
  router.get(``, asyncMiddleware(async (req, res) => {
    const skip = parseInt(req.query.skip, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || MAX_AT_ONCE;

    if (skip < 0 || limit < 0) {
      res.status(400).send(`Invalid query params: "skip" and "limit" must be an integer not lower than 0.`);
      return;
    }

    res.send(await toPage(await router.offersStore.getAll(), skip, limit));
  }));

  // Post an offer
  const cpUpload = upload.fields([{name: `avatar`, maxCount: 1}, {name: `preview`, maxCount: 10}]);

  router.post(``, jsonParser, cpUpload, asyncMiddleware(async (req, res) => {
    const {body, files} = req;
    let avatarFile = null;
    const photos = (files && `preview` in files) ? files.preview.slice() : null;

    if (files && `avatar` in files) {
      avatarFile = files.avatar[0];
      body.avatar = avatarFile.originalname;
    }

    if (!body.features) {
      body.features = [];
    }

    if (req.headers[`content-type`].search(/multipart\/form-data/) !== -1
      && typeof body.features === `string`) {
      body.features = [body.features];
    }


    /**
     * Create a new offer object based on post data.
     * @param {Object} postObj
     * @return {Object}
     */
    const createOffer = (postObj) => {
      const address = postObj.address.split(`,`);
      const now = Date.now();

      postObj.photos = (photos) ? photos.map((pic, i) => `/api/offers/${now}/preview/${i}`) : [];

      return {
        author: {
          name: postObj.name || getRandomElement(NAMES),
          avatar: (avatarFile) ? `api/offers/${now}/avatar` : `/img/avatars/default.png`,
        },
        offer: postObj,
        location: {
          x: +address[0],
          y: +address[1],
        },
        date: now,
      };
    };

    const saveImage = (id, stream) => router.imagesStore.save(id, stream);

    /**
     * Save images as batch.
     * @param {Array} fileData
     * @param {string} id
     * @return {Array}
     */
    const saveImages = (fileData, id) => {
      let avatarLoader = [];
      let loaders = [];

      if (fileData) {
        if (fileData[`avatar`]) {
          avatarLoader.push(saveImage(id, toStream(fileData.avatar[0].buffer)));
        }

        if (fileData[`preview`]) {
          loaders = fileData.preview.map((file, i) => saveImage(`${id}_${i}`, toStream(file.buffer))
          );
        }
      }

      return loaders.concat(avatarLoader);
    };

    const errors = validate(body);
    if (errors.length) {
      res.status(400);
      res.json(errors);
      return;
    }

    const offer = createOffer({...body});
    const result = await router.offersStore.saveOne(offer);

    if (avatarFile || photos) {
      await Promise.all(saveImages(files, result.insertedId));
    }

    res.send(offer);
  }));
};
