const router = require('express').Router();
const { getAccountInfo, deleteAccount, updateAccountInfo } = require('../controllers/user.controller');
const { authUser } = require('../../middlewares/auth.middleware');
const { 
  param_User_Id, 
  body_User_Name, 
  body_User_Lastname,
  body_User_Gender,
  body_User_Birthdate,
  body_User_City,
  body_User_Role,
  body_User_Email,
  body_User_Password,
} = require('../../services/apiValidations');

router.get(
  '/getAccountInfo',
  authUser,
  getAccountInfo
);

router.delete(
  '/deleteAccount',
  authUser,
  deleteAccount
);

router.put(
  '/updateAccountInfo',
  [
    body_User_Name(false),
    body_User_Lastname(false),
    body_User_Gender(false),
    body_User_Birthdate(false),
    body_User_City(false)
  ],
  authUser,
  updateAccountInfo
);

module.exports = router;
