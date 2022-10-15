/**
 * Converts mongoose.Decimal128 value to a String
 * @param {mongoose.Decimal128} value
 * @returns {String}
 */
const decimalConverter = (value) => {
  if (typeof value !== 'undefined') {
    return parseFloat(value.toString());
  }
  
  console.log(value);

  return value;
};

module.exports = decimalConverter;
