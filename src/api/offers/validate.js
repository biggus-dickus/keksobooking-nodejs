'use strict';

const validator = require(`../../utils/validators`);
const {REQUIRED_FIELDS, TITLE_MIN_LENGTH, TITLE_MAX_LENGTH, TYPES, PRICE_MIN, PRICE_MAX, X_MIN, X_MAX, Y_MIN, Y_MAX, ROOMS_MIN, ROOMS_MAX, FEATURES, ALLOWED_IMAGES} = require(`../../model/constraints`);


const makeError = (type, field, message) => ({
  error: type,
  fieldName: field,
  errorMessage: message
});

const validations = [{
  field: `title`,
  isRequired: true,
  method: `isBetween`,
  validWhen: true,
  args: [TITLE_MIN_LENGTH, TITLE_MAX_LENGTH, true, true],
  message: `Must be a string and contain from ${TITLE_MIN_LENGTH} to ${TITLE_MAX_LENGTH} characters.`
},
{
  field: `type`,
  isRequired: true,
  method: `isOneOf`,
  validWhen: true,
  args: [TYPES],
  message: `Can only be any of the following: ${TYPES}`
},
{
  field: `price`,
  isRequired: true,
  method: `isBetween`,
  validWhen: true,
  args: [PRICE_MIN, PRICE_MAX, true, true],
  message: `Must be from ${PRICE_MIN} to ${PRICE_MAX}.`
},
{
  field: `address`,
  isRequired: true,
  method: `isValidAddress`,
  validWhen: true,
  message: `Must be a string of the following format: "X,Y", and its X/Y values must be from ${X_MIN} to ${X_MAX} for X, and from ${Y_MIN} to ${Y_MAX} for Y.`
},
{
  field: `checkin`,
  isRequired: true,
  method: `isValidTime`,
  validWhen: true,
  message: `Must be a valid 24-hour format string, e.g. "21:12"`
},
{
  field: `checkout`,
  isRequired: true,
  method: `isValidTime`,
  validWhen: true,
  message: `Must be a valid 24-hour format string, e.g. "12:21"`
},
{
  field: `rooms`,
  isRequired: true,
  method: `isBetween`,
  validWhen: true,
  args: [ROOMS_MIN, ROOMS_MAX, true, true],
  message: `May contain from ${ROOMS_MIN} to ${ROOMS_MAX} rooms.`
},
{
  field: `features`,
  isRequired: false,
  method: `hasDuplicates`,
  validWhen: false,
  message: `Cannot contain duplicate items.`
},
{
  field: `features`,
  isRequired: false,
  method: `includesAll`,
  args: [FEATURES],
  validWhen: true,
  message: `Can only be any of the following: ${FEATURES}.`
},
{
  field: `avatar`,
  isRequired: false,
  method: `isAcceptedImgType`,
  validWhen: true,
  message: `Can only be any of the following extensions: ${ALLOWED_IMAGES}.`
},
{
  field: `preview`,
  isRequired: false,
  method: `isAcceptedImgType`,
  validWhen: true,
  message: `Can only be any of the following extensions: ${ALLOWED_IMAGES}.`
}];


const validate = (data) => {
  const errors = [];

  if (!validator.includesAll(REQUIRED_FIELDS, Object.keys(data))) {
    errors.push(`Not all required fields were provided. Required fields are: ${REQUIRED_FIELDS.join(`, `)}`);
    return errors;
  }

  validations.forEach((rule) => {
    const value = (rule.field === `title`) ? data[rule.field].length : data[rule.field];
    const args = rule.args || [];

    if (rule.isRequired || (!rule.isRequired && value)) {
      if (validator[rule.method](value, ...args) !== rule.validWhen) {
        errors.push(makeError(`Validation error`, rule.field, rule.message));
      }
    }
  });

  return errors;
};

module.exports = validate;
