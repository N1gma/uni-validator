# uni-validator
To install the stable version:
```
npm install --save uni-validator
```
### Examples of validator methods

```javascript
import Validator from 'uni-validator';

const validator = new Validator(); // instance with default rules

const validator = new Validator(myRules); // or instance with custom rules 
// gonna override default ones with same names (see link below)
```
[About validation rules](#about-validation-rules)

#### Validate single value 
.validate(stringToValidate, [arrayOfRules](#about-validation-rules))

```javascript
validator.validate('someValue', [{
  name: 'minLength',
  len: 10
},{
  name: 'equals',
  to: 'someValueee'
}])
```
###### will return object below if validation fails for both rules:
###### for each rules which didnt passed validation equal pair of key-value will be created in results object
###### if one of rules  fail validation - ```valid: false``` otherwise ```valid: true```
```javascript
  results: {
     minLength: 'minimum of 10 characters',
     equals: 'should be equal to someValueee'
  },
  valid: false
```
###### otherwise if validation ended with success will be returned:
```javascript
  results: {},
  valid: true
```
#### Validate multiple values
.validateGroup(groups)
```javascript
validator.validateGroup([
  {
    data: 'someValue1', // value to validate
    rules: [
      {
        name: 'minLength',
        len: 8
      }
    ],
    field: 'value1' // optional (will fallback to value of data key (currently 'someValue1')), provide it if you want other key-name of current value in returned validation results
  }, //second value
  {
     data: 'someValue2',
     rules: [
       {
         name: 'minLength',
         len: 12
       },{
         name: 'equals',
         to: 'someValueee',
         toAlias: 'password'
       }
     ]
  }])
```
###### returns
```javascript
{ 
  errorObjects: {
    value1: {
      results: {},
      valid: true
    },
    someValue2: {
      results: {
        equals: 'should be equal to password',
        minLength: 'minimum of 12 characters'
      },
      valid: false
    }
  },
  valid: false
}
```
#### Add custom validation rule
.addRule(name, rule, errorMsg)
```javascript
validator.addRule(
  'myNewRule', // value to validate
  (val, options) => val !== options.notEqual, // function(val, options) - if returns true after validation = rule marked as valid
  (val, options) => `${ val } shouldn't be equal to ${ options.notEqual }` //can be function(val, options) or string - text to show if validation fails
);
//or
validator.addRule(
  'myNewRule2',
   val => val !== '2',
  'shouldn't be equal to 2'
);
```
###### returns this
### About validation rules
In order to use your new rules or old ones you should pass them in array as second argument of .validate or .validateGroup (for each instance to validate) method. Invocation of method will go though all rules and if a single rule will fail validation it will return process mareked as valid: false with messages from all rules failed during validation. You can pass em as objects with structure
```javascript
[
  {
    name: 'ruleName',  // name of rule (first argument of .addRule method)
    ...customValues    // set of key:values which used to determine if validation process went success. Will be inside options object.
  },
  ...otherObjectRules
]
```
or you can pass them as simple strings if rule doesnt require additional params to compare
```javascript
['empty', 'isNumber', ...otherStrings]
```
##### You can check methods here:
https://github.com/N1gma/uni-validator/blob/master/src/index.js
##### And current validation rules which you can use:
https://github.com/N1gma/uni-validator/blob/master/src/validatorRules/commonRules.js
