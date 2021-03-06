'use strict';

require(`dotenv`).config();
const winston = require(`winston`);


const logger = winston.createLogger({
  level: process.env.SERVER_LOG_LEVEL || `info`,
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({filename: `error.log`, level: `error`}),
    new winston.transports.File({filename: `combined.log`})
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== `production`) {
  logger.add(new winston.transports.Console({
    level: `verbose`,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    )
  }));
}

module.exports = logger;
