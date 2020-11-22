const createError = require('http-errors');
const { users, userRoles, roles, sequelize } = require('../../sequelize/models');
const { validationResult } = require('express-validator');
const {formErrorObject, MAIN_ERROR_CODES} = require('../../services/errorHandling');

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
      console.log(error);
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
      const foundedUser = await users.findByPk(userId);
      if(!foundedUser) return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_NOT_FOUND, 'User not found')));
      return res.status(200).json({ foundedUser });
    } catch (error) {
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }
      const { userId } = req.params;
      const foundedUser = await users.findByPk(userId);
      if(!foundedUser) return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_NOT_FOUND, 'User not found')));
      const deletedUser = await users.destroy({
        where: {
          id: userId
        }
      });
      if(!deletedUser) return next(createError(formErrorObject(MAIN_ERROR_CODES.DATABASE_ERROR, 'Cannot delete user')));

      return res.status(204).end();
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  updateUser: async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await transaction.rollback();
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      }
      const { userId } = req.params;
      const { name, lastname, gender, birthdate, city, role } = req.body;
      const foundedUser = await users.findByPk(userId);
      if(!foundedUser) {
        await transaction.rollback();
        return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_NOT_FOUND, 'User not found')));
      }
      
      let userRolesData = [];
      
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
          id: userId
        },
        transaction
      });

      if(role) {
        userRolesData = role.map(item => ({fkUserId: userId, fkRoleId: item}));
        await userRoles.destroy({
          where: {
            fkUserId: userId,
          }
        });

        await userRoles.bulkCreate(
          userRolesData, 
          {
            fields: ['fkUserId', 'fkRoleId'],
            transaction
          }
        );
  
      }
      
      await transaction.commit();

      const updatedUser = await users.findOne({
        where: { id: userId },
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
      await transaction.rollback();
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  createUser: async (req, res, next) => {
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
}