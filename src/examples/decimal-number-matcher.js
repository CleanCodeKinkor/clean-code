// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

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
  }

  match(value) {
    let result = new ValidationResult();

    if (value != null) {
      if (this.params.length === 0) {
        let number;
        try {
          number = new Decimal(value);
        } catch (e) {
          number = null;
          result.addInvalidTypeError("doubleNumber.e001", "The value is not a valid decimal number.");
        }
        if (number) {
          if (number.precision(true) > 11) {
            result.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");
          }
        }
      } else if (this.params.length === 1) {
        let number;
        try {
          number = new Decimal(value);
        } catch (e) {
          number = null;
          result.addInvalidTypeError("doubleNumber.e001", "The value is not a valid decimal number.");
        }
        if (number) {
          if (number.precision(true) > this.params[0]) {
            result.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");
          }
        }
      } else if (this.params.length === 2) {
        let number;
        try {
          number = new Decimal(value);
        } catch (e) {
          number = null;
          result.addInvalidTypeError("doubleNumber.e001", "The value is not a valid decimal number.");
        }
        if (number) {
          if (number.precision(true) > this.params[0]) {
            result.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");
          }
          if (number.decimalPlaces() > this.params[1]) {
            result.addInvalidTypeError("doubleNumber.e003", "The value exceeded maximum number of decimal places.");
          }
        }
      }
    }

    return result;
  }
}

module.exports = DecimalNumberMatcher;
