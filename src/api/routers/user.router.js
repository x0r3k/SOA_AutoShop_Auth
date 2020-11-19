const router = require('express').Router();
const {
  getUsers, getUser, deleteUser
} = require('../controllers/user.controller');
const { query, param } = require('express-validator');
const isNumber = require('../../helpers/isNumber');


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

module.exports = router;
