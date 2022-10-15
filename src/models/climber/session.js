const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const { eGrade } = require('./enums/eGrade');
const { eClimbingType } = require('./enums/eClimbingType');
const decimalConverter = require('../../utils/decimalConverter');

const sessionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    price: {
      type: mongoose.Decimal128,
      get: decimalConverter,
    },
    climbingType: {
      type: String,
      enum: eClimbingType,
      required: true,
    },
    highestGrade: {
      type: String,
      enum: eGrade,
      required: true,
    },
    isSingleEntree: {
      type: Boolean,
      default: false,
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
sessionSchema.plugin(toJSON);
sessionSchema.plugin(paginate);

/**
 * @typedef session
 */
const session = mongoose.model('Session', sessionSchema);

module.exports = session;
