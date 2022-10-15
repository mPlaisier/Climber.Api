const Joi = require('joi');
const { objectId } = require('../custom.validation');
const { eClimbingType } = require('../../models/climber/enums/eClimbingType');
const { eGrade } = require('../../models/climber/enums/eGrade');

const getSessions = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    // Field filters
    club: Joi.string().custom(objectId),
    climbingType: Joi.string().valid(...eClimbingType),
  }),
};

const createSession = {
  body: Joi.object().keys({
    date: Joi.date().required(),
    subscription: Joi.string().custom(objectId),
    club: Joi.string().custom(objectId).required(),
    price: Joi.number().precision(2),
    climbingType: Joi.string()
      .valid(...eClimbingType)
      .required(),
    highestGrade: Joi.string()
      .valid(...eGrade)
      .required(),
    isSingleEntree: Joi.boolean(),
  }),
};

const updateSession = {
  params: Joi.object().keys({
    sessionId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    date: Joi.date(),
    subscription: Joi.string().custom(objectId),
    club: Joi.string().custom(objectId),
    price: Joi.number().precision(2),
    climbingType: Joi.string().valid(...eClimbingType),
    highestGrade: Joi.string().valid(...eGrade),
    isSingleEntree: Joi.boolean(),
  }),
};

const deleteSession = {
  params: Joi.object().keys({
    sessionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
};
