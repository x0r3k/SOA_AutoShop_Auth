const createError = require('http-errors');
const { users, userRoles, roles, sequelize } = require('../../sequelize/models');
const { validationResult } = require('express-validator');
const { formErrorObject, MAIN_ERROR_CODES } = require('../../services/errorHandling');
const { getTokens } = require('../../services/generateTokens');

module.exports = {
  register: async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await transaction.rollback();
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }
      const { email, password, name, lastname, gender, birthdate, city, role } = req.body;

      const userExists = await users.findOne({ where: { email } });
      if(userExists) {
        await transaction.rollback();
        return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_EXISTS, 'User with this email already exists')));
      }
      let userRolesData = [];
      const fullname = `${name || foundedUser.name} ${lastname || foundedUser.lastname}`;
      const createdUser = await users.create({
        email, 
        password,
        name,
        lastname,
        fullname,
        gender,
        birthdate,
        city,
      },{
        transaction
      });

      userRolesData = role.map(item => ({fkUserId: createdUser.id, fkRoleId: item}));
      await userRoles.bulkCreate(
        userRolesData, 
        {
          fields: ['fkUserId', 'fkRoleId'],
          transaction
        }
      );
      
      await transaction.commit();

      const userResponse = await users.findOne({
        where: { id: createdUser.id },
        include: {
          model: roles,
          through: {
            model: userRoles,
            attributes: [],
          },
        },
      });

      return res.status(200).json({ createdUser: userResponse });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  // authorization: async (req, res, next) => {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       await transaction.rollback();
  //       return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
  //     }
  //   } catch (error) {
  //     return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
  //   }
  // },

  test: (req, res) => {
    try {
      getTokens({});
      return res.status(200).end();
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  }
}