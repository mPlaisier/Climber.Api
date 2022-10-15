const mongoose = require('mongoose');
const decimalConverter = require('../../../src/utils/decimalConverter');

describe('Decimal converter', () => {
  test('should convert mongoose.Decimal128 to a string', () => {
    const value = mongoose.Types.Decimal128.fromString('3000.00');

    const result = decimalConverter(value);

    expect(result.toString()).toEqual('3000');
  });

  test('should not convert undefined', () => {
    const value = undefined;

    const result = decimalConverter(value);

    expect(result).toEqual(undefined);
  });
});