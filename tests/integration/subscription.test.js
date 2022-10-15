const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Subscription } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const {
  subscriptionCreate,
  subscriptionOne,
  subscriptionTwo,
  subscriptionThree,
  insertSubscriptions,
} = require('../fixtures/subscription.fixture');

setupTestDB();

describe('Subscription routes', () => {
  describe('POST /v1/subscription', () => {
    let newSubscription;

    beforeEach(() => {
      newSubscription = subscriptionCreate;
    });

    test('should return 201 and successfully create new subscription if data is ok', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post('/v1/subscription')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newSubscription)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('user');
      expect(res.body).toEqual({
        id: expect.anything(),
        club: newSubscription.club.toHexString(),
        datePurchase: newSubscription.datePurchase,
        subscriptionType: newSubscription.subscriptionType,
        price: newSubscription.price,
        isActive: newSubscription.isActive,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/subscription').send(newSubscription).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if name is missing', async () => {
      await insertUsers([userOne]);

      newSubscription = {};

      await request(app)
        .post('/v1/subscription')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newSubscription)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/subscription', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne]);
      await insertSubscriptions([subscriptionOne, subscriptionTwo, subscriptionThree], userOne);

      const res = await request(app)
        .get('/v1/subscription')
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
        id: subscriptionOne._id.toHexString(),
        club: subscriptionOne.club.toHexString(),
        datePurchase: subscriptionOne.datePurchase,
        subscriptionType: subscriptionOne.subscriptionType,
        price: subscriptionOne.price,
        isActive: subscriptionOne.isActive,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get('/v1/subscription').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should only return the subscriptions of the user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertSubscriptions([subscriptionOne, subscriptionTwo], userOne);
      await insertSubscriptions([subscriptionThree], userTwo);

      const res = await request(app)
        .get('/v1/subscription')
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

  describe('PATCH /v1/subscription/:subscriptionId', () => {
    test('should return 200 and successfully update subscription', async () => {
      await insertUsers([userOne]);
      await insertSubscriptions([subscriptionOne], userOne);

      const updateBody = {
        price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
      };

      const res = await request(app)
        .patch(`/v1/subscription/${subscriptionOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: subscriptionOne._id.toHexString(),
        club: subscriptionOne.club.toHexString(),
        datePurchase: subscriptionOne.datePurchase,
        subscriptionType: subscriptionOne.subscriptionType,
        price: updateBody.price,
        isActive: subscriptionOne.isActive,
      });

      const subscription = await Subscription.find(subscriptionOne._id);
      expect(subscription).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertSubscriptions([subscriptionOne], userOne);

      const updateBody = {
        price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
      };

      await request(app).patch(`/v1/subscription/${subscriptionOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating subscription of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertSubscriptions([subscriptionOne], userOne);
      await insertSubscriptions([subscriptionTwo], userTwo);

      const updateBody = {
        price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
      };

      await request(app)
        .patch(`/v1/subscription/${subscriptionTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is updating subscription that is not found', async () => {
      await insertUsers([userOne]);
      const updateBody = {
        price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
      };

      await request(app)
        .patch(`/v1/subscription/${subscriptionOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/subscription/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/subscription/:subscriptionId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertSubscriptions([subscriptionOne], userOne);

      await request(app)
        .delete(`/v1/subscription/${subscriptionOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const subscription = await Subscription.findById(subscriptionOne._id);
      expect(subscription).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertSubscriptions([subscriptionOne], userOne);

      await request(app).delete(`/v1/subscription/${subscriptionOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is deleting subscription of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertSubscriptions([subscriptionOne], userOne);
      await insertSubscriptions([subscriptionTwo], userTwo);

      await request(app)
        .delete(`/v1/subscription/${subscriptionTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is deleting subscription that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`/v1/subscription/${subscriptionOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`/v1/subscription/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
