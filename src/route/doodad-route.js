'use strict';

const logger = require('../lib/logger');
const Doodad = require('../model/object');
const storage = require('../lib/storage');

module.exports = function routeDoodad(router) {
  router.post('/api/v1/doodad', (req, res) => {
    logger.log(logger.INFO, 'DOODAD-ROUTE: POST /api/v1/doodad');

    try {
      const newDoodad = new Doodad(req.body.title, req.body.content);
      storage.create('Doodad', newDoodad)
        .then((doodad) => {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(doodad));
          res.end();
          return undefined;
        });
    } catch (err) {
      logger.log(logger.ERROR, `ROUTE-DOODAD: There was a bad request ${err}`);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('Bad request THIS OTHER ONE');
      res.end();
      return undefined;
    }
    return undefined;
  });

  router.get('/api/v1/doodad', (req, res) => {
    if (!req.url.query.id) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('Your request requires an id');
      res.end();
      return undefined;
    }

    storage.fetchOne('Doodad', req.url.query.id)
      .then((item) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(item));
        res.end();
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Resource not found');
        res.end();
        return undefined;
      });
    return undefined;
  });
};
