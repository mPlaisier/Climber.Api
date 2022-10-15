const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const { subscriptionType } = require('./enums/subscriptionType');
const decimalConverter = require('../../utils/decimalConverter');

const subscriptionSchema = new mongoose.Schema(
  {
    datePurchase: {
      type: Date,
      required: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
    },
    subscriptionType: {
      type: String,
      enum: subscriptionType,
      required: true,
    },
    price: {
      type: mongoose.Decimal128,
      required: true,
      get: decimalConverter,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      private: true,
    },
  },
  { toJSON: { getters: true } }
);

// add plugin that converts mongoose to json
subscriptionSchema.plugin(toJSON);
subscriptionSchema.plugin(paginate);

/**
 * @typedef Subscription
 */
const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
