const { query, param, check } = require('express-validator');
const isNumber = require('../helpers/isNumber');
const { GENDER, ROLES } = require('../helpers/constants');

//if parameter required - check with "exists()", otherwise with "optional()"
const isRequiredParameter = (isRequired, paramName) => {
  return isRequired ? check(paramName).exists().withMessage('Is required').bail() : check(paramName).optional();
}
module.exports = {
  param_User_Id: () => {
    return param('userId').exists().withMessage('Is required').bail()
      .custom(value => isNumber(value) ? true : false).withMessage('ID Should be an integer value').bail();
  },
  body_User_Name: (isRequired) => {
    return isRequiredParameter(isRequired, 'name').notEmpty().withMessage('Should not be empty').bail()
      .isString().withMessage('Should be string')
      .isLength({ max: 20 }).withMessage('Max length is 20 symbols')
      .custom(value => /^([a-zA-Zа-яА-Я\-]+ ?)+$/gi.test(value) ? true : false).withMessage('Wrong format');
  },
  body_User_Lastname: (isRequired) => {
    return isRequiredParameter(isRequired, 'lastname').notEmpty().withMessage('Should not be empty').bail()
      .isString().withMessage('Should be string')
      .isLength({ max: 30 }).withMessage('Max length is 30 symbols')
      .custom(value => /^([a-zA-Zа-яА-Я\-]+ ?)+$/gi.test(value) ? true : false).withMessage('Wrong format');
  },
  body_User_Gender: (isRequired) => {
    return isRequiredParameter(isRequired, 'gender').notEmpty().withMessage('Should not be empty').bail()
      .isIn(GENDER).withMessage(`Allowed values ${GENDER}`);
  },
  body_User_Birthdate: (isRequired) => {
    return isRequiredParameter(isRequired, 'birthdate').notEmpty().withMessage('Should not be empty').bail()
      .isInt().withMessage('Should be integer');
  },
  body_User_City: (isRequired) => {
    return isRequiredParameter(isRequired, 'city').notEmpty().withMessage('Should not be empty').bail()
      .isString().withMessage('Should be string')
      .isLength({ max: 50 }).withMessage('Max length is 50 symbols')
      .custom(value => /^([a-zA-Zа-яА-Я\-]+ ?)+\S$/gi.test(value) ? true : false).withMessage('Wrong format');
  },
  body_User_Role: (isRequired) => {
    return isRequiredParameter(isRequired, 'role').isArray().withMessage('Should be array').bail()
      .isArray({ min: 1 }).withMessage('Min length is 1 element').bail()
      .custom(value => value.map(item => ROLES.includes(item)).includes(false) ? false : true)
      .withMessage(`Allowed array elements ${ROLES}`).bail()
      .custom(value => (new Set(value)).size !== value.length ? false : true)
      .withMessage('Should not have duplicates');
  },
  body_User_Email: (isRequired) => {
    return isRequiredParameter(isRequired, 'email')
      .notEmpty().withMessage('Should not be empty').bail()
      .isString().withMessage('Should be string')
      .isLength({ max: 20 }).withMessage('Max length is 30 symbols')
      .custom(value => /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value) ? true : false)
      .withMessage('Wrong format');
  },
  body_User_Password: (isRequired) => {
    return isRequiredParameter(isRequired, 'password')
      .notEmpty().withMessage('Should not be empty').bail()
      .isString().withMessage('Should be string')
      .isLength({ max: 50 }).withMessage('Max length is 50 symbols')
      .isLength({ min: 8 }).withMessage('Min length is 8 symbols')
      .custom(value => /^[a-zA-Z0-9]{8,50}$/.test(value) ? true : false)
      // .custom(value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,50}$/.test(value) ? true : false)
      .withMessage('Wrong format');
  },
  body_ConfirmationPassword: () => {
    return check('passwordConfirm').exists().withMessage('Is required').bail()
      .notEmpty().withMessage('Should not be empty').bail()
      .isString().withMessage('Should be string')
      .isLength({ min: 8 }).withMessage('Min length is 8 symbols').bail()
      .isLength({ max: 50 }).withMessage('Max length is 50 symbols').bail()
      .custom((value, { req }) => {
        return value !== req.body.password ? false : true
      }).withMessage('ConfirmationPassword and Password are not equal');
  },
  body_UserSessions_Fingerprint: () => {
    return check('fingerprint').exists().withMessage('Is required').bail()
      .notEmpty().withMessage('Should not be empty').bail()
      .isString().withMessage('Should be string');
  },
  body_UserSessions_RefreshToken: () => {
    return check('refreshToken').exists().withMessage('Is required').bail()
      .notEmpty().withMessage('Should not be empty').bail()
      .isString().withMessage('Should be string');
  }
}

/*NAME OF FUNCTION

1-st part - location
2-nd part - DB model capitalized name
3-rd part - DB model's attribute capitalized name*/