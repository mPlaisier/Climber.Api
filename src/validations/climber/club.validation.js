const Joi = require('joi');
const { objectId } = require('../custom.validation');

const { eClubClimbingType } = require('../../models/climber/enums/eClubClimbingType');

const getClubs = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    // Field filters
    name: Joi.string(),
    isMember: Joi.boolean(),
    city: Joi.string(),
  }),
};

const createClub = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    clubClimbingType: Joi.string()
      .valid(...eClubClimbingType)
      .required(),
    isMember: Joi.boolean(),
    city: Joi.string(),
  }),
};

const updateClub = {
  params: Joi.object().keys({
    clubId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    clubClimbingType: Joi.string().valid(...eClubClimbingType),
    isMember: Joi.boolean(),
    city: Joi.string(),
  }),
};

const deleteClub = {
  params: Joi.object().keys({
    clubId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getClubs,
  createClub,
  updateClub,
  deleteClub,
};
