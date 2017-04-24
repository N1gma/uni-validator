import commonRules from './validatorRules/commonRules';

const importRules = {
  ...commonRules
};

/**
 * @class
 */
class Validator {
  constructor() {
    this.rules = importRules;
  }

  /**
   * Provide validation to value param
   * @param {string} value - String to validate
   * @param {Array} options - array of strings or objects(if  rule requires additional params) rules
   * @return {{results: {}, valid: boolean}}
   * @desc results is a composition of name - error message of rules which failed during validation process
   */
  validate(value = '', options) {
    this.errorObject = {
      results: {},
      valid: true
    };
    for (let i = 0; i < options.length; i += 1) {
      const option = options[i];
      const error = option.name
        ? this.rules[option.name](value, option)
        : this.rules[option](value);
      error && this.buildResults(error)
    }
    return this.errorObject;
  }

  /**
   * Provide validation to group of values
   * @param {Array} data - array of objects to validate with keys field, data, rules
   * @return {{valid: boolean, errorObjects: Object}}
   */
  validateGroup(data) {
    const errorObjects = data.reduce((result, validationProps) => ({
      ...result,
      [validationProps.field]: this.validate(validationProps.data || '', validationProps.rules)
    }), {});

    const valid = Object.values(errorObjects).every((checkResult) => checkResult.valid);

    return { valid, errorObjects };
  }

  addRegExpRule(name, rules, errorMsg) {
    this.rules[name] = val => {
      if (Array.isArray(rules)) {
        rules.forEach((rule) => {
          if (!rule.test(val)) {
            this.buildResults({ [name]: errorMsg });
          }
        });
      } else if (!rules.test(val)) {
        this.buildResults({ [name]: errorMsg });
      }
    };
  }

  addRule(name, rule, errorMsg){
    this.rules[name] = (val, options) => !rule(val, options) && { [name]: errorMsg };
  }

  buildResults(error) {
    this.errorObject.results = {
      ...this.errorObject.results,
      ...error
    };
    this.errorObject.valid = false;
  }
}

export default Validator;
