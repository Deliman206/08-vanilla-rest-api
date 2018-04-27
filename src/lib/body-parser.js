'use strict';

const logger = require('./logger');

module.exports = function bodyParser(req) {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST' && req.method !== 'PUT') {
      return resolve(req);
    }

    let message = '';
    req.on('data', (data) => {
      logger.log(logger.INFO, `BODY PARSER: chunked request data: ${data.toString()}`);
      message += data.toString();
      logger.log(logger.INFO, message);
    });

    req.on('end', () => {
      try {
        req.body = JSON.parse(message);
        console.log(req.body);
        return resolve(req);
      } catch (err) {
        console.log('hit this in body parser');
        return reject(err);
      }
    });

    req.on('error', (err) => {
      logger.log(logger.ERROR, ` THIS BODY PARSER: Error occured on parsing request body ${err}`);
      return reject(err);
    });
    return undefined;
  });
};
