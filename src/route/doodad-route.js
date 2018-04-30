'use strict';

const logger = require('../lib/logger');
const Doodad = require('../model/object');
const storage = require('../lib/storage');
const response = require('../lib/response');

module.exports = function routeDoodad(router) {
  router.post('/api/v1/doodad', (req, res) => {
    logger.log(logger.INFO, 'DOODAD-ROUTE: POST /api/v1/doodad');
    try {
      const newDoodad = new Doodad(req.body.title, req.body.content);
      storage.create('Doodad', newDoodad)
        .then((doodad) => {
          response.writeJSON(res, 201, doodad); 
        });
    } catch (err) {
      logger.log(logger.ERROR, `ROUTE-DOODAD: There was a bad request ${err}`);
      response.writeText(res, 400, err);
    }
    return undefined;
  });
  router.get('/api/v1/doodad', (req, res) => {
    if (!req.url.query.id) {
      response.writeText(res, 400, 'Your request requires an id');
      return undefined;
    }

    storage.fetchOne('Doodad', req.url.query.id)
      .then((item) => {
        response.writeJSON(res, 200, item);
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        response.writeText(res, 404, 'Resource not found');
      });
    return undefined;
  });
  router.get('/api/v1/doodad/all', (req, res) => {
    storage.fetchAll('Doodad')
      .then((items) => {
        logger.log(logger.INFO, 'All files were retrieved');
        response.writeJSON(res, 200, items);
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        response.writeText(res, 404, 'Resource not found');
      });
    return undefined;
  });
  router.delete('/api/v1/doodad/delete', (req, res) => {
    if (!req.url.query.id) {
      response.writeText(res, 400, 'Your request requires an id');
    }
    storage.delete('Doodad', req.url.query.id)
      .then(() => {
        response.writeText(res, 202, 'Your have successfully Deleted your Doodad!');        
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        response.writeText(res, 404, 'Resource not found');
      });
    return undefined;
  });
};
