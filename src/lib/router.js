'use strict';

const logger = require('./logger');
const bodyParser = require('./body-parser');
const urlParser = require('./url-parser');

const Router = module.exports = function router() {
  this.routes = {
    // {
    //   '/api/v1/doodad': (req, res) => {},
    //   '/api/v1/doodad/:id': (req, res) => {},
    // }
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
  };
};

// Example of bracket notation
// const obj = {
//   'some-prose': 'value'
// }

// obj['some-prose']

Router.prototype.get = function get(endpoint, callback) {
  this.routes.GET[endpoint] = callback;
};

Router.prototype.post = function post(endpoint, callback) {
  this.routes.POST[endpoint] = callback;
};

Router.prototype.put = function put(endpoint, callback) {
  this.routes.PUT[endpoint] = callback;
};

Router.prototype.delete = function del(endpoint, callback) {
  this.routes.DELETE[endpoint] = callback;
};

Router.prototype.route = function route() {
  return (req, res) => {
    Promise.all([
      urlParser(req),
      bodyParser(req),
    ])
      .then(() => {
        if (typeof this.routes[req.method][req.url.pathname] === 'function') {
          this.routes[req.method][req.url.pathname](req, res);
          return;
        }
        
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('THEN: Route not found');
        res.end();
      })
      .catch((err) => {
        if (err instanceof SyntaxError) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('CATCH: Route not found');
          res.end();
          return undefined;
        }
        logger.log(logger.ERROR, JSON.stringify(err));
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.write('Bad Request THIS ONE');
        res.end();
        return undefined;
      });
  };
};
