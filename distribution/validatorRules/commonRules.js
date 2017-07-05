"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ValidatorRules = {
    empty: function empty(val) {
        return val.trim().length === 0 && { empty: "can't be empty" };
    },

    lengthRange: function lengthRange(val, options) {
        return (val.length < options.from || val.length > options.to) && val && { lengthRange: "characters minimum of " + options.from + " maximum to " + options.to };
    },

    valueRange: function valueRange(val, options) {
        return (val < options.from || val > options.to) && { valueRange: "value ranges from  " + options.from + " to " + options.to };
    },

    maxLength: function maxLength(val, options) {
        return val.length > options.len && { maxLength: "maximum of " + options.len + " characters" };
    },

    minLength: function minLength(val, options) {
        return val.length < options.len && val && { minLength: "minimum of " + options.len + " characters" };
    },

    lessThan: function lessThan(val, options) {
        return val > options.val && { lessThan: "should be less than " + options.val };
    },

    moreThan: function moreThan(val, options) {
        return val <= options.val && { moreThan: "should be more than " + options.val };
    },

    equals: function equals(val, options) {
        return options.to && val && val !== options.to && { equals: "should be equal to " + (options.toAlias || options.to) };
    }
};

exports.default = ValidatorRules;