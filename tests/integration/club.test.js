const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Club } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const { newClub, clubOne, clubTwo, clubThree, insertClubs } = require('../fixtures/club.fixture');

setupTestDB();

describe('Club routes', () => {
  describe('POST /v1/club', () => {
    test('should return 201 and successfully create new club if data is ok', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post('/v1/club')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newClub)
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('user');
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newClub.name,
        clubClimbingType: newClub.clubClimbingType,
        isMember: newClub.isMember,
        city: newClub.city,
      });

      const dbClub = await Club.findById(res.body.id);
      expect(dbClub).toBeDefined();
      expect(dbClub).toMatchObject({
        name: newClub.name,
        clubClimbingType: newClub.clubClimbingType,
        isMember: newClub.isMember,
        city: newClub.city,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/club').send(newClub).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if name is missing', async () => {
      await insertUsers([userOne]);

      const invalidNewClub = {};

      await request(app)
        .post('/v1/club')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(invalidNewClub)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if name is invalid', async () => {
      await insertUsers([userOne]);

      const invalidClub = {
        name: '',
      };

      await request(app)
        .post('/v1/club')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(invalidClub)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/club', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne]);
      await insertClubs([clubOne, clubTwo, clubThree], userOne);

      const res = await request(app)
        .get('/v1/club')
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
        id: clubOne._id.toHexString(),
        name: clubOne.name,
        clubClimbingType: clubOne.clubClimbingType,
        isMember: clubOne.isMember,
        city: clubOne.city,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get('/v1/club').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should only return the clubs of the user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertClubs([clubOne, clubTwo], userOne);
      await insertClubs([clubThree], userTwo);

      const res = await request(app)
        .get('/v1/club')
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

  describe('PATCH /v1/club/:clubId', () => {
    test('should return 200 and successfully update club', async () => {
      await insertUsers([userOne]);
      await insertClubs([clubOne], userOne);

      const updateBody = {
        name: faker.name.findName(),
      };

      const res = await request(app)
        .patch(`/v1/club/${clubOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: clubOne._id.toHexString(),
        name: updateBody.name,
        clubClimbingType: clubOne.clubClimbingType,
        isMember: clubOne.isMember,
        city: clubOne.city,
      });

      const club = await Club.find(clubOne._id);
      expect(club).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertClubs([clubOne], userOne);

      const updateBody = {
        name: faker.name.findName(),
      };

      await request(app).patch(`/v1/club/${clubOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is updating club of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertClubs([clubOne], userOne);
      await insertClubs([clubTwo], userTwo);

      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/club/${clubTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is updating club that is not found', async () => {
      await insertUsers([userOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/club/${clubOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);
      const updateBody = { name: faker.name.findName() };

      await request(app)
        .patch(`/v1/club/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/club/:clubId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([userOne]);
      await insertClubs([clubOne], userOne);

      await request(app)
        .delete(`/v1/club/${clubOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const club = await Club.findById(clubOne._id);
      expect(club).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);
      await insertClubs([clubOne], userOne);

      await request(app).delete(`/v1/club/${clubOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if user is deleting club of other user', async () => {
      await insertUsers([userOne, userTwo]);
      await insertClubs([clubOne], userOne);
      await insertClubs([clubTwo], userTwo);

      await request(app)
        .delete(`/v1/club/${clubTwo._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is deleting club that is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`/v1/club/${clubOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if userId is not a valid mongo id', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete(`/v1/club/invalidId`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
