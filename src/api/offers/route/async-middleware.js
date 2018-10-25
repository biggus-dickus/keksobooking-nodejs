'use strict';

const asyncMiddleware = (fn) => (req, res, _next) => fn(req, res, _next).catch(_next);

module.exports = asyncMiddleware;
