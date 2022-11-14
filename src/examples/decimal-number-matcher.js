// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

const defaultMaxOfDigits = 11;
const indexNumOfDigits = 0;
const indexNumOfDecimal = 1;

const errors = {
  valideNum : {
    code: "doubleNumber.e001",
    message: "The value is not a valid decimal number."
  },
  maxOfDigits : {
    code: "doubleNumber.e002",
    message: "The value exceeded maximum number of digits."
  },
  maxOfDecimal : {
    code: "doubleNumber.e003",
    message: "The value exceeded maximum number of decimal places."
  }
}
Object.freeze(errors);

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
      this.result.addInvalidTypeError(errors.valideNum.code, errors.valideNum.message);
      return this.result;
    }

    if (this.isExceedMaxOfDigits(number)) {
      this.result.addInvalidTypeError(errors.maxOfDigits.code, errors.maxOfDigits.message);
    }

    if (this.isExceedMaxOfDecimal(number)) {
      this.result.addInvalidTypeError(errors.maxOfDecimal.code, errors.maxOfDecimal.message);
    }

    return result;
  }

  isExceedMaxOfDigits(number) {
    return number.precision(true) > this.getMaxNumOfDigitals();
  }

  isExceedMaxOfDecimal(number) {
    return this.params.length >= (indexNumOfDecimal + 1)
      && number.decimalPlaces() > this.params[indexNumOfDecimal];
  }

  getMaxNumOfDigitals() {
    if (this.params.length >= (indexNumOfDigits + 1)) {
      return this.params[indexNumOfDigits];
    }
    return defaultMaxOfDigits;
  }
}

module.exports = DecimalNumberMatcher;
