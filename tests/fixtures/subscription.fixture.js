const mongoose = require('mongoose');
const faker = require('faker');
const { Subscription } = require('../../src/models');
const { subscriptionType } = require('../../src/models/climber/enums/subscriptionType');
const { clubOne } = require('./club.fixture');

const subscriptionCreate = {
  datePurchase: new Date().toISOString(),
  club: mongoose.Types.ObjectId(),
  subscriptionType: faker.random.arrayElement(subscriptionType),
  price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
  isActive: faker.datatype.boolean(),
};

const subscriptionOne = {
  _id: mongoose.Types.ObjectId(),
  datePurchase: new Date().toISOString(),
  club: clubOne._id.toHexString(),
  subscriptionType: faker.random.arrayElement(subscriptionType),
  price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
  isActive: faker.datatype.boolean(),
};

const subscriptionTwo = {
  _id: mongoose.Types.ObjectId(),
  datePurchase: new Date().toISOString(),
  club: mongoose.Types.ObjectId(),
  subscriptionType: faker.random.arrayElement(subscriptionType),
  price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
  isActive: faker.datatype.boolean(),
};

const subscriptionThree = {
  _id: mongoose.Types.ObjectId(),
  datePurchase: new Date().toISOString(),
  club: mongoose.Types.ObjectId(),
  subscriptionType: faker.random.arrayElement(subscriptionType),
  price: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }),
  isActive: faker.datatype.boolean(),
};

const insertSubscriptions = async (subscriptions, user) => {
  await Subscription.insertMany(subscriptions.map((subscription) => ({ ...subscription, user })));
};

module.exports = {
  subscriptionCreate,
  subscriptionOne,
  subscriptionTwo,
  subscriptionThree,
  insertSubscriptions,
};
