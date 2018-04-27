'use strict';

const response = module.exports = {};

response.writeJSON = (res, status, message) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(message));
  res.end();
  return undefined;
};
response.writeText = (res, status, message) => {
  res.writeHead(status, { 'Content-Type': 'text/plain' });
  res.write(message);
  res.end();
  return undefined;
};
