const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Session } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { sessionCreate, sessionOne, sessionTwo, sessionThree, insertSessions } = require('../fixtures/session.fixture');
const { clubOne, insertClubs } = require('../fixtures/club.fixture');
const { subscriptionOne, insertSubscriptions } = require('../fixtures/subscription.fixture');

setupTestDB();

describe('Session routes', () => {
  describe('POST /v1/session', () => {
    let newSession;

    beforeEach(() => {
      newSession = sessionCreate;
    });

    test('should return 201 and successfully create new session if data is ok', async () => {
      await insertUsers([userOne]);
      await insertClubs([clubOne], userOne);
      await insertSubscriptions([subscriptionOne], userOne);

      const res = await request(app)
        .post('/v1/session')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newSession)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('user');
      expect(res.body).toEqual({
        id: expect.anything(),
        date: newSession.date,
        subscription: newSession.subscription,
        club: newSession.club,
        price: newSession.price,
        climbingType: newSession.climbingType,
        highestGrade: newSession.highestGrade,
        isSingleEntree: newSession.isSingleEntree,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/session').send(newSession).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if name is missing', async () => {
      await insertUsers([userOne]);

      newSession = {};

      await request(app)
        .post('/v1/session')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newSession)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/session', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne]);
      await insertSessions([sessionOne, sessionTwo, sessionThree], userOne);

      const res = await request(app)
        .get('/v1/session')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0]).toEqual({
        id: sessionOne._id.toHexString(),
        date: sessionOne.date,
        subscription: null, // populated
        club: null, // populated
        price: sessionOne.price,
        climbingType: sessionOne.climbingType,
        highestGrade: sessionOne.highestGrade,
        isSingleEntree: sessionOne.isSingleEntree,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get('/v1/session').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should only return the sessions of the user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertSessions([sessionOne, sessionTwo], userOne);
      await insertSessions([sessionThree], userTwo);

      const res = await request(app)
        .get('/v1/session')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
    });
  });

  describe('PATCH /v1/session/:sessionId', () => {
    test('should return 200 and successfully update session', async () => {
      await insertUsers([userOne]);
      await insertSessions([sessionOne], userOne);

      const updateBody = {
        price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
      };

      const res = await request(app)
        .patch(`/v1/session/${sessionOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: sessionOne._id.toHexString(),
        date: sessionOne.date,
        subscription: sessionOne.subscription.toHexString(),
        club: sessionOne.club.toHexString(),
        price: updateBody.price,
        climbingType: sessionOne.climbingType,
        highestGrade: sessionOne.highestGrade,
        isSingleEntree: sessionOne.isSingleEntree,
      });

      const session = await Session.find(sessionOne._id);
      expect(session).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertSessions([sessionOne], userOne);

      const updateBody = {
        price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
      };

      await request(app).patch(`/v1/session/${sessionOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating session of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertSessions([sessionOne], userOne);
      await insertSessions([sessionTwo], userTwo);

      const updateBody = {
        price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
      };

      await request(app)
        .patch(`/v1/session/${sessionTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is updating session that is not found', async () => {
      await insertUsers([userOne]);
      const updateBody = {
        price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
      };

      await request(app)
        .patch(`/v1/session/${sessionOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/session/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/session/:sessionId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertSessions([sessionOne], userOne);

      await request(app)
        .delete(`/v1/session/${sessionOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const session = await Session.findById(sessionOne._id);
      expect(session).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertSessions([sessionOne], userOne);

      await request(app).delete(`/v1/session/${sessionOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is deleting session of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertSessions([sessionOne], userOne);
      await insertSessions([sessionTwo], userTwo);

      await request(app)
        .delete(`/v1/session/${sessionTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is deleting session that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`/v1/session/${sessionOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`/v1/session/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
