'use strict';

const HOUR = 3600;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const DEFAULT_PATH = `${process.cwd()}/tmp/offer.json`;
const MAX_AT_ONCE = 20;

module.exports = {HOUR, DAY, WEEK, DEFAULT_PATH, MAX_AT_ONCE};
