const router = require('express').Router();
const { getUsers, getUser, deleteUser, updateUser, createUser } = require('../controllers/admin.user.controller');
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
  '/getUsers', 
  getUsers
);

router.get(
  '/getUser/:userId',
  [ 
    param_User_Id()
  ],
  getUser
);

router.delete(
  '/deleteUser/:userId',
  [ 
    param_User_Id()
  ],
  deleteUser
);

router.put(
  '/updateUser/:userId',
  [
    param_User_Id(),
    body_User_Name(false),
    body_User_Lastname(false),
    body_User_Gender(false),
    body_User_Birthdate(false),
    body_User_City(false),
    body_User_Role(false)
  ],
  updateUser
);

router.post(
  '/createUser',
  [
    body_User_Email(true),
    body_User_Password(true),
    body_User_Name(true),
    body_User_Lastname(true),
    body_User_Gender(true),
    body_User_Birthdate(true),
    body_User_City(true),
    body_User_Role(true)
  ],
  createUser
)

module.exports = router;
