const Joi = require('joi');
const { objectId } = require('../custom.validation');

const getSubscriptions = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    // Field filters
    club: Joi.string().custom(objectId),
    subscriptionType: Joi.string().valid('TenTurnCard', 'ThreeMonthSubscription', 'OneYearSubscription'),
    isActive: Joi.boolean(),
  }),
};

const createSubscription = {
  body: Joi.object().keys({
    datePurchase: Joi.date().required(),
    club: Joi.string().custom(objectId).required(),
    subscriptionType: Joi.string().valid('TenTurnCard', 'ThreeMonthSubscription', 'OneYearSubscription').required(),
    price: Joi.number().precision(2).required(),
    isActive: Joi.boolean(),
  }),
};

const updateSubscription = {
  params: Joi.object().keys({
    subscriptionId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    datePurchase: Joi.date(),
    club: Joi.string().custom(objectId),
    subscriptionType: Joi.string().valid('TenTurnCard', 'ThreeMonthSubscription', 'OneYearSubscription'),
    price: Joi.number().precision(2),
    isActive: Joi.boolean(),
  }),
};

const deleteSubscription = {
  params: Joi.object().keys({
    subscriptionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};
