const router = require('express').Router();
const { getUsers, getUser, deleteUser, updateUser } = require('../controllers/user.controller');
const { query, param, check } = require('express-validator');
const isNumber = require('../../helpers/isNumber');
const { GENDER, ROLES } = require('../../helpers/constants');


router.get(
  '/getUsers', 
  getUsers
);

router.get(
  '/getUser/:userId',
  [ 
    param('userId').exists().withMessage('ID of user in url is required').bail()
      .custom(value => isNumber(value) ? true : false).withMessage('ID Should be an integer value').bail()
  ],
  getUser
);

router.delete(
  '/deleteUser/:userId',
  [ 
    param('userId').exists().withMessage('ID of user in url is required').bail()
      .custom(value => isNumber(value) ? true : false).withMessage('ID Should be an integer value').bail()
  ],
  deleteUser
);

router.put(
  '/updateUser/:userId',
  [
    param('userId').exists().withMessage('Is required').bail()
      .custom(value => isNumber(value) ? true : false).withMessage('Should be an integer value').bail(),
    check('name').optional().notEmpty().withMessage('Should no be empty').bail()
      .isString().withMessage('Should be string')
      .isLength({max: 20}).withMessage('Max length is 20 symbols')
      .custom(value => /^([a-zA-Zа-яА-Я\-]+ ?)+$/gi.test(value) ? true : false).withMessage('Wrong format'),
    check('lastname').optional().notEmpty().withMessage('Should not be empty').bail()
      .isString().withMessage('Should be string')
      .isLength({max: 30}).withMessage('Max length is 20 symbols')
      .custom(value => /^([a-zA-Zа-яА-Я\-]+ ?)+$/gi.test(value) ? true : false).withMessage('Wrong format'),
    check('gender').optional().notEmpty().withMessage('Should not be empty').bail()
      .isIn(GENDER).withMessage(`Allowed values ${GENDER}`),
    check('birthdate').optional().notEmpty().withMessage('Should not be empty').bail()
      .isInt().withMessage('Should be integer'),
    check('city').optional().notEmpty().withMessage('Should not be empty').bail()
      .isString().withMessage('Should be string')
      .isLength({max: 50}).withMessage('Max length is 20 symbols')
      .custom(value => /^([a-zA-Zа-яА-Я\-]+ ?)+\S$/gi.test(value) ? true : false).withMessage('Wrong format'),
    check('role').optional().isArray().withMessage('Should be array').bail()
      .isArray({min: 1}).withMessage('Min length is 1 element').bail()
      .custom(value => value.map(item => ROLES.includes(item)).includes(false) ? false : true)
      .withMessage(`Allowed array elements ${ROLES}`).bail()
      .custom(value => (new Set(value)).size !== value.length ? false : true)
      .withMessage('Should not have duplicates')
  ],
  updateUser
)

module.exports = router;
