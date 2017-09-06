'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _commonRules = require('./validatorRules/commonRules');

var _commonRules2 = _interopRequireDefault(_commonRules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var importRules = _extends({}, _commonRules2.default);

/**
 * @class
 */

var Validator = function () {
    function Validator() {
        var _this = this;

        var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Validator);

        this.chainValidation = function (option, value) {
            var error = option.name ? _this.rules[option.name](value, option) : _this.rules[option](value);
            if (error) {
                _this.buildResults(error);
            } else if (option.next) {
                _this.chainValidation(option.next, value);
            }
        };

        this.rules = _extends({}, importRules, rules);
    }

    _createClass(Validator, [{
        key: 'validate',


        /**
         * Provide validation to value param
         * @param {string} value - String to validate
         * @param {Array} options - array of strings or objects(if  rule requires additional params) rules
         * @return {{results: {}, valid: boolean}}
         * @desc results is a composition of name - error message of rules which failed during validation process
         */
        value: function validate() {
            var _this2 = this;

            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var options = arguments[1];

            this.errorObject = {
                results: {},
                valid: true
            };
            options.forEach(function (option) {
                _this2.chainValidation(option, value);
            });
            return this.errorObject;
        }

        /**
         * Provide validation to group of values
         * @param {Array} data - array of objects to validate with keys field, data, rules
         * @return {{valid: boolean, errorObjects: Object}}
         */

    }, {
        key: 'validateGroup',
        value: function validateGroup(data) {
            var _this3 = this;

            var errorObjects = data.reduce(function (result, validationProps) {
                return _extends({}, result, _defineProperty({}, validationProps.field || validationProps.data || 'no_value_provided', _this3.validate(validationProps.data || '', validationProps.rules)));
            }, {});

            var valid = Object.values(errorObjects).every(function (checkResult) {
                return checkResult.valid;
            });

            return { valid: valid, errorObjects: errorObjects };
        }
    }, {
        key: 'addRegExpRule',
        value: function addRegExpRule(name, rules, errorMsg) {
            var _this4 = this;

            this.rules[name] = function (val) {
                if (Array.isArray(rules)) {
                    rules.forEach(function (rule) {
                        if (!rule.test(val)) {
                            _this4.buildResults(_defineProperty({}, name, errorMsg));
                        }
                    });
                } else if (!rules.test(val)) {
                    _this4.buildResults(_defineProperty({}, name, errorMsg));
                }
            };
        }

        /**
         * @param {string} name - new rule name (should be passed with this name in 'validate' method)
         * @param {function} rule - depending on this param return value current validation will be failed(return false) or resolved (returns true)
         * @param {string} errorMsg - message to show in errors object about current rule if it fails (e.g. 'cannot be empty')
         */

    }, {
        key: 'addRule',
        value: function addRule(name, rule, errorMsg) {
            this.rules[name] = function (val, options) {
                var rulecheck = !rule(val, options);
                return rulecheck && _defineProperty({}, name, errorMsg instanceof Function ? errorMsg(val, options) : errorMsg);
            };
            return this;
        }
    }, {
        key: 'buildResults',
        value: function buildResults(error) {
            this.errorObject.results = _extends({}, this.errorObject.results, error);
            this.errorObject.valid = false;
        }
    }]);

    return Validator;
}();

exports.default = Validator;