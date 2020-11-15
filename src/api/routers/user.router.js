const router = require('express').Router();
const {
  getUsers,
} = require('../controllers/user.controller');

router.get('/user/getUsers', getUsers);

module.exports = router;
