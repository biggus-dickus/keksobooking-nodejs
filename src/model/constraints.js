'use strict';

module.exports = {
  TITLES: [`Большая уютная квартира`, `Маленькая неуютная квартира`, `Огромный прекрасный дворец`, `Маленький ужасный дворец`, `Красивый гостевой домик`, `Некрасивый негостеприимный домик`, `Уютное бунгало далеко от моря`, `Неуютное бунгало по колено в воде`],
  TITLE_MIN_LENGTH: 30,
  TITLE_MAX_LENGTH: 140,
  X_MIN: 300,
  X_MAX: 900,
  Y_MIN: 150,
  Y_MAX: 500,
  PRICE_MIN: 1000,
  PRICE_MAX: 100000,
  TYPES: [`flat`, `palace`, `house`, `bungalow`],
  ROOMS_MIN: 1,
  ROOMS_MAX: 100,
  GUESTS_MIN: 1,
  GUESTS_MAX: 10,
  TIMES: [`12:00`, `13:00`, `14:00`],
  FEATURES: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  PHOTOS: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`],
  NAMES: [`Keks`, `Pavel`, `Nikolay`, `Alex`, `Ulyana`, `Anastasiya`, `Julia`],
  REQUIRED_FIELDS: [`title`, `type`, `price`, `address`, `checkin`, `checkout`, `rooms`],
  ALLOWED_IMAGES: [`jpg`, `png`]
};
