const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const { eClubClimbingType } = require('./enums/eClubClimbingType');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  clubClimbingType: {
    type: String,
    enum: eClubClimbingType,
    required: true,
  },
  isMember: {
    type: Boolean,
    default: false,
  },
  city: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    private: true,
  },
});

// add plugin that converts mongoose to json
clubSchema.plugin(toJSON);
clubSchema.plugin(paginate);

/**
 * @typedef Club
 */
const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
