const router = require('express').Router();
const { register, authorization, updateTokens, checkToken } = require('../controllers/auth.controller');
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
  body_UserSessions_Fingerprint,
  body_UserSessions_RefreshToken
} = require('../../services/apiValidations');
const { authUser } = require('../../middlewares/auth.middleware');


router.post(
  '/register',
  [
    body_User_Email(true),
    body_User_Password(true),
    body_ConfirmationPassword(),
    body_User_Name(true),
    body_User_Lastname(false),
    body_User_Gender(true),
    body_User_Birthdate(true),
    body_User_City(true),
    body_User_Role(true)
  ],
  register
);

router.post(
  '/authorization',
  [
    body_User_Email(true),
    body_User_Password(true),
    body_UserSessions_Fingerprint()
  ],
  authorization
);

router.put(
  '/updateTokens',
  [
    body_UserSessions_RefreshToken(),
    body_UserSessions_Fingerprint()
  ],
  updateTokens
);

router.get(
  '/checkToken',
  authUser,
  checkToken
);

module.exports = router;