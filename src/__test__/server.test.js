'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const logger = require('../lib/logger');

const testPort = 5000;
const mockResource = { title: 'test title', content: 'test content' };
const badResource = {};
let mockId = null; 

beforeAll(() => server.start(testPort));
afterAll(() => server.stop());

describe('VALID request to the API', () => {
  describe('GET /api/v1/doodad', () => {
    test('Should Return 400 Status if no Query', () => {
      return superagent.get(`:${testPort}/api/v1/doodad`)
        .query({})
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    test('Should Fetch One Doodad up correct Query Id', () => {
      return superagent.post(`:${testPort}/api/v1/doodad`)
        .send(mockResource)
        .then((res) => {
          mockId = res.body.id;
          return mockId;
        })
        .then(() => {
          return superagent.get(`:${testPort}/api/v1/doodad`)
            .query({ id: mockId })
            .then((res) => {
              expect(res.status).toEqual(200);
            });
        });
    });
    test('Should Return 404 Status if Query Id does not Exist', () => {
      return superagent.get(`:${testPort}/api/v1/doodad`)
        .query({ id: 'BAD ID' })
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });
  describe('GET /api/v1/doodad/all', () => {
    test('Should Return 200 status if Query for All Doodads succeeds', () => {
      return superagent.get(`:${testPort}/api/v1/doodad/all`)
        .then((res) => {
          expect(res.status).toEqual(200);
        });
    });
  });  
  describe('POST /api/v1/doodad', () => {
    test('Should respond with status 201 and created a new doodad', () => {
      return superagent.post(`:${testPort}/api/v1/doodad`)
        .send(mockResource)
        .then((res) => {
          logger.log(logger.INFO, res.body);
          mockId = res.body.id; // HINT: Why do we need to reassign this?
          expect(res.body.title).toEqual(mockResource.title);
          expect(res.body.content).toEqual(mockResource.content);
          expect(res.body.id).toEqual(mockId);
          expect(res.status).toEqual(201);
        });
    });
    test('Should Return 400 Status on Request with no Title and Content', () => {
      return superagent.post(`:${testPort}/api/v1/doodad`)
        .send(badResource)
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });
  describe('DELETE /api/v1/delete', () => {
    test('Should Return 202 Status when Doodad has been Deleted', () => {
      return superagent.post(`:${testPort}/api/v1/doodad`)
        .send(mockResource)
        .then((res) => {
          mockId = res.body.id;
          return mockId;
        })
        .then(() => {
          return superagent.delete(`:${testPort}/api/v1/doodad/delete`)
            .query({ id: mockId })
            .then((res) => {
              expect(res.status).toEqual(202);
            });
        });
    });
    test('Should Return 400 Status on Delete Id does not exist', () => {
      return superagent.delete(`:${testPort}/api/v1/doodad`)
        .query({ id: 'BAD ID' })
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
    test('Should Return 404 status on Delete Route when the is no Query for Id', () => {
      return superagent.delete(`:${testPort}/api/v1/doodad`)
        .query({})
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });
});
