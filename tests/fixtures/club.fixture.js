const mongoose = require('mongoose');
const faker = require('faker');
const { Club } = require('../../src/models');
const { eClubClimbingType } = require('../../src/models/climber/enums/eClubClimbingType');

const newClub = {
  name: faker.name.findName(),
  clubClimbingType: faker.random.arrayElement(eClubClimbingType),
  isMember: true,
  city: faker.name.findName(),
};

const clubOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  clubClimbingType: faker.random.arrayElement(eClubClimbingType),
  isMember: faker.datatype.boolean(),
  city: faker.name.findName(),
};

const clubTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  clubClimbingType: faker.random.arrayElement(eClubClimbingType),
  isMember: faker.datatype.boolean(),
  city: faker.name.findName(),
};

const clubThree = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  clubClimbingType: faker.random.arrayElement(eClubClimbingType),
  isMember: faker.datatype.boolean(),
  city: faker.name.findName(),
};

const insertClubs = async (clubs, user) => {
  await Club.insertMany(clubs.map((club) => ({ ...club, user })));
};

module.exports = {
  newClub,
  clubOne,
  clubTwo,
  clubThree,
  insertClubs,
};
