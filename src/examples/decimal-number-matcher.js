// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

const DEFAULT_MAX_OF_DIGITS = 11;
const INDEX_NUM_OF_DIGITS = 0;
const INDEX_NUM_OF_DECIMAL = 1;

const ERRORS = {
  VALID_NUM: {
    code: "doubleNumber.e001",
    message: "The value is not a valid decimal number."
  },
  MAX_OF_DIGITS: {
    code: "doubleNumber.e002",
    message: "The value exceeded maximum number of digits."
  },
  MAX_OF_DECIMAL: {
    code: "doubleNumber.e003",
    message: "The value exceeded maximum number of decimal places."
  }
};
Object.freeze(ERRORS);

/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 * In addition, it must comply to the rules described below.
 *
 * @param params - Matcher can take 0 to 2 parameters with following rules:
 * - no parameters: validates that number of digits does not exceed the maximum value of 11.
 * - one parameter: the parameter specifies maximum length of number for the above rule (parameter replaces the default value of 11)
 * - two parameters:
 *   -- first parameter represents the total maximum number of digits,
 *   -- the second parameter represents the maximum number of decimal places.
 *   -- both conditions must be met in this case.
 */
class DecimalNumberMatcher {
  constructor(...params) {
    this.params = params;
    this.result = new ValidationResult();
  }

  match(value) {
    if (value === null) {
      return this.result;
    }

    let number;
    try {
      number = new Decimal(value);
    } catch (e) {
      this.result.addInvalidTypeError(ERRORS.VALID_NUM.code, ERRORS.VALID_NUM.message);
      return this.result;
    }

    if (this.isExceedMaxOfDigits(number)) {
      this.result.addInvalidTypeError(ERRORS.MAX_OF_DIGITS.code, ERRORS.MAX_OF_DIGITS.message);
    }

    if (this.isExceedMaxOfDecimal(number)) {
      this.result.addInvalidTypeError(ERRORS.MAX_OF_DECIMAL.code, ERRORS.MAX_OF_DECIMAL.message);
    }

    return this.result;
  }

  isExceedMaxOfDigits(number) {
    return number.precision(true) > this.getMaxNumOfDigitals();
  }

  isExceedMaxOfDecimal(number) {
    return this.params.length >= (INDEX_NUM_OF_DECIMAL + 1)
      && number.decimalPlaces() > this.params[INDEX_NUM_OF_DECIMAL];
  }

  getMaxNumOfDigitals() {
    if (this.params.length >= (INDEX_NUM_OF_DIGITS + 1)) {
      return this.params[INDEX_NUM_OF_DIGITS];
    }
    return DEFAULT_MAX_OF_DIGITS;
  }
}

module.exports = DecimalNumberMatcher;
