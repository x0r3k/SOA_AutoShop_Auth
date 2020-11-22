const createError = require('http-errors');
const { users, userRoles, roles, sequelize } = require('../../sequelize/models');
const { validationResult } = require('express-validator');
const {formErrorObject, MAIN_ERROR_CODES} = require('../../services/errorHandling');

module.exports = {
  getAccountInfo: async (req, res, next) => {
    try {
      const userPayload = req.user;
      const foundedUser = await users.findByPk(userPayload.userId);
      if(!foundedUser) return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_NOT_FOUND, 'User not found')));
      return res.status(200).json({ foundedUser });
    } catch (error) {
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  deleteAccount: async (req, res, next) => {
    try {
      const userPayload = req.user;
      const deletedUser = await users.destroy({
        where: {
          id: userPayload.userId
        }
      });
      if(!deletedUser) return next(createError(formErrorObject(MAIN_ERROR_CODES.DATABASE_ERROR, 'Cannot delete user')));

      return res.status(204).end();
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  updateAccountInfo: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }
      const userPayload = req.user;
      const { name, lastname, gender, birthdate, city } = req.body;
      
      const fullname = `${name || foundedUser.name} ${lastname || foundedUser.lastname}`;
      await users.update({
        name,
        lastname,
        fullname,
        gender,
        birthdate,
        city,
      },{
        where: {
          id: userPayload.userId
        },
      });

      const updatedUser = await users.findOne({
        where: { id: userPayload.userId },
        include: {
          model: roles,
          through: {
            model: userRoles,
            attributes: [],
          },
        },
      });

      return res.status(200).json({ updatedUser });
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },
}