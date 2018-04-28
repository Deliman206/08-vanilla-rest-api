'use strict';

const logger = require('./logger');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), { suffix: 'Prom' });

const storage = module.exports = {};

storage.create = function create(schema, item) {
  if (!schema) return Promise.reject(new Error('Cannot create a new item, schema required'));
  if (!item) return Promise.reject(new Error('Cannot create a new item, item required'));
  const json = JSON.stringify(item);
  logger.log(logger.INFO, 'STORAGE: Created a new resource');
  return fs.writeFileProm(`${__dirname}/../data/${schema}/${item.id}.json`, json)
    .then(() => {
      logger.log(logger.INFO, 'STORAGE: Created a new resource');
      return item;
    })
    .catch(err => Promise.reject(err));
};

storage.fetchOne = function fetchOne(schema, id) {
  if (!schema) return Promise.reject(new Error('Cannot find Doodad, schema required'));
  if (!id) return Promise.reject(new Error('Cannot find Doodad, id required'));

  if (!`${__dirname}/../data/${schema}/${id}.json`) {
    return Promise.reject(new Error('Doodad not found'));
  }
  return fs.readFileProm(`${__dirname}/../data/${schema}/${id}.json`)
    .then((data) => {
      logger.log(logger.INFO, `STORAGE: Gathered one Doodad ${JSON.parse(data.toString())}`);
      return Promise.resolve(JSON.parse(data.toString()));
    })
    .catch(err => Promise.reject(err));
};


storage.fetchAll = function fetchAll(schema) {
  if (!schema) return Promise.reject(new Error('expected schema name')); 
  return fs.readdirProm(`${__dirname}/../data/${schema}`)
    .then((files) => {
      return Promise.resolve(files);
    })
    .catch((err) => {
      throw err;
    });
};

storage.delete = function del(schema, id) {
  if (!schema) return Promise.reject(new Error('expected schema name'));
  if (!id) return Promise.reject(new Error('expected id'));
  if (!fs.realpathProm(`${__dirname}/../data/${schema}`)) return Promise.reject(new Error(`schema not found ${schema}`));
  if (!fs.readFileProm(`${__dirname}/../data/${schema}/${id}.json`)) {
    return Promise.reject(new Error('item not found'));
  }
  return fs.unlinkProm(`${__dirname}/../data/${schema}/${id}.json`)
    .then(() => {
      logger.log(logger.INFO, 'Your Doodad was Deleted');
      return Promise.resolve(undefined);
    }) 
    .catch((err) => {
      logger.log(logger.ERROR, `${__dirname}/../data/${schema}/${id}.json was deleted`);
      return Promise.reject(new Error(err));
    });
};
