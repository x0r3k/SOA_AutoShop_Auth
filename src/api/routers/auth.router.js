const router = require('express').Router();
const { register, test } = require('../controllers/auth.controller');
const {
  body_User_Name,
  body_User_Lastname,
  body_User_Gender,
  body_User_Birthdate,
  body_User_City,
  body_User_Role,
  body_User_Email,
  body_User_Password,
  body_ConfirmationPassword,
} = require('../../services/apiValidations');

router.post(
  '/register',
  [
    body_User_Email(true),
    body_User_Password(true),
    body_ConfirmationPassword(),
    body_User_Name(true),
    body_User_Lastname(true),
    body_User_Gender(true),
    body_User_Birthdate(true),
    body_User_City(true),
    body_User_Role(true)
  ],
  register
);

router.get(
  '/test',
  test
)

module.exports = router;