const createError = require('http-errors');
const { users, sequelize } = require('../../sequelize/models');
const { validationResult } = require('express-validator');
const {formErrorObject, MAIN_ERROR_CODES} = require('../../services/errorHandling')

module.exports = {
  getUsers: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }

      const userList = await users.findAll();
      return res.status(200).json({
        userList
      });
    } catch (error) {
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  getUser: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }
      const { userId } = req.params;
      const foundedUser = await users.findOne({
        where: {
          Id: userId
        }
      });
      return res.status(200).json({
        foundedUser
      });
    } catch (error) {
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  }
}