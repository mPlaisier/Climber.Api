const mongoose = require('mongoose');
const faker = require('faker');
const { Club } = require('../../src/models');

const clubOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  isMember: faker.datatype.boolean(),
  city: faker.name.findName(),
};

const clubTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  isMember: faker.datatype.boolean(),
  city: faker.name.findName(),
};

const clubThree = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  isMember: faker.datatype.boolean(),
  city: faker.name.findName(),
};

const insertClubs = async (clubs, user) => {
  await Club.insertMany(clubs.map((club) => ({ ...club, user })));
};

module.exports = {
  clubOne,
  clubTwo,
  clubThree,
  insertClubs,
};
