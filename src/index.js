import commonRules from './validatorRules/commonRules';

const importRules = {
    ...commonRules
};

/**
 * @class
 */
class Validator {
    constructor(rules = {}) {
        this.rules = {
            ...importRules,
            ...rules
        };
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
            if (error) {
                this.buildResults(error);
            }
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
            [validationProps.field || validationProps.data || 'no_value_provided']: this.validate(validationProps.data || '', validationProps.rules)
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

    /**
     * @param {string} name - new rule name (should be passed with this name in 'validate' method)
     * @param {function} rule - depending on this param return value current validation will be failed(return false) or resolved (returns true)
     * @param {string} errorMsg - message to show in errors object about current rule if it fails (e.g. 'cannot be empty')
     */
    addRule(name, rule, errorMsg) {
        this.rules[name] = (val, options) => {
            const rulecheck = !rule(val, options);
            return rulecheck && { [name]: errorMsg instanceof Function ? errorMsg(val, options) : errorMsg };
        };
        return this;
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
