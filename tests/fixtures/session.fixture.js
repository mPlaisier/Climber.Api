const mongoose = require('mongoose');
const faker = require('faker');
const { Session } = require('../../src/models');
const { eClimbingType } = require('../../src/models/climber/enums/eClimbingType');
const { eGrade } = require('../../src/models/climber/enums/eGrade');
const { clubOne } = require('./club.fixture');
const { subscriptionOne } = require('./subscription.fixture');

const sessionCreate = {
  date: new Date().toISOString(),
  subscription: subscriptionOne._id.toHexString(),
  club: clubOne._id.toHexString(),
  price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
  climbingType: faker.random.arrayElement(eClimbingType),
  highestGrade: faker.random.arrayElement(eGrade),
  isSingleEntree: false,
};

const sessionOne = {
  _id: mongoose.Types.ObjectId(),
  date: new Date().toISOString(),
  subscription: mongoose.Types.ObjectId(),
  club: mongoose.Types.ObjectId(),
  price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
  climbingType: faker.random.arrayElement(eClimbingType),
  highestGrade: faker.random.arrayElement(eGrade),
  isSingleEntree: faker.datatype.boolean(),
};

const sessionTwo = {
  _id: mongoose.Types.ObjectId(),
  date: new Date().toISOString(),
  subscription: mongoose.Types.ObjectId(),
  club: mongoose.Types.ObjectId(),
  price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
  climbingType: faker.random.arrayElement(eClimbingType),
  highestGrade: faker.random.arrayElement(eGrade),
  isSingleEntree: faker.datatype.boolean(),
};

const sessionThree = {
  _id: mongoose.Types.ObjectId(),
  date: new Date().toISOString(),
  subscription: mongoose.Types.ObjectId(),
  club: mongoose.Types.ObjectId(),
  price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
  climbingType: faker.random.arrayElement(eClimbingType),
  highestGrade: faker.random.arrayElement(eGrade),
  isSingleEntree: faker.datatype.boolean(),
};

const insertSessions = async (sessions, user) => {
  await Session.insertMany(sessions.map((session) => ({ ...session, user })));
};

module.exports = {
  sessionCreate,
  sessionOne,
  sessionTwo,
  sessionThree,
  insertSessions,
};
