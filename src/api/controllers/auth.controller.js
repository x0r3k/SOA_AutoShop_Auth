const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { users, userRoles, roles, refreshSessions, sequelize, Sequelize } = require('../../sequelize/models');
const { Op } = Sequelize;
const { validationResult } = require('express-validator');
const { formErrorObject, MAIN_ERROR_CODES } = require('../../services/errorHandling');
const { getTokens } = require('../../services/generateTokens');
const bcrypt = require('bcryptjs');
const { JSONWebTokens } = require('../../configs/jwtConfig');

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
        password: bcrypt.hashSync(password, 10),
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

  authorization: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      } 
      const { email, password, fingerprint } = req.body;
      const foundedUser = await users.findOne({
        where: {
          email,
        },
        include: [
          { model: refreshSessions },
          { model: roles, through: { model: userRoles, attributes: [] } }
        ]
      });

      //if no user with this email or password are not equal
      if(!foundedUser || !bcrypt.compareSync(password, foundedUser.password)) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_NOT_FOUND, 'Invalid email or password')));
      }
      const tokenPayload = {
        userId: foundedUser.id, 
        userEmail: foundedUser.email, 
        userRoles: foundedUser.roles.map(item => item.id)
      };
      const { newAccessToken, newRefreshToken, expiresIn, refreshExpiresIn } = getTokens(tokenPayload);
      const sessions = foundedUser.refreshSessions;
      const foundedSession = sessions.find(item => item.fingerprint === fingerprint);

      if(foundedSession) {
        await refreshSessions.update({ 
          refreshToken: newRefreshToken, 
          fkUserId: foundedUser.id, 
          expiresIn: refreshExpiresIn, 
          updatedAt: Date.now() 
        },{
          where: { id: foundedSession.id }
        });
      }
      else {
        if(sessions.length >= 5) {
          await refreshSessions.update({ 
            refreshToken: newRefreshToken, 
            fkUserId: foundedUser.id, 
            expiresIn: refreshExpiresIn, 
            createdAt: Date.now(), 
            updatedAt: Date.now() 
          }, {
            where: {
              fkUserId: foundedUser.id,
              updatedAt: {
                [Op.in]: sequelize.literal(`(select min(updatedAt) from refreshSessions where fkUserId=${foundedUser.id})`),
              }
            }
          });
        }
        else {
          await refreshSessions.create({
            refreshToken: newRefreshToken,
            fkUserId: foundedUser.id,
            userAgent: req.headers['user-agent'],
            fingerprint,
            expiresIn: refreshExpiresIn,
            createdAt: Date.now(), 
            updatedAt: Date.now()
          });
        }
      }

      return res.status(200).json({accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn});
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

  updateTokens: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.VALIDATION_BODY, 'Invalid request params', errors.errors)));
      } 
      const { refreshToken, fingerprint } = req.body;

      try {
        jwt.verify(refreshToken, JSONWebTokens.secret);
      } catch(error) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.TOKEN_ERROR, 'Token is not valid')));
      }

      const session = await refreshSessions.findOne({
        where: {
          refreshToken
        }
      });
      
      if(!session) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.UNAUTHORIZED, 'Session not found')));
      }

      if(session.fingerprint !== fingerprint) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.SESSION_ERROR, 'Wrong fingerprint-refreshToken pair')));
      }
      if(session.expiresIn < (Date.now()+300000)) {
        return next(createError(formErrorObject(MAIN_ERROR_CODES.SESSION_ERROR, 'Refresh token expired')));
      }

      const foundedUser = await users.findOne({
        where: {
          id: session.fkUserId,
        },
        include: [
          { model: roles, through: { model: userRoles, attributes: [] } }
        ]
      });
      const tokenPayload = {
        userId: foundedUser.id, 
        userEmail: foundedUser.email, 
        userRoles: foundedUser.roles.map(item => item.id)
      };

      const { newAccessToken, newRefreshToken, expiresIn, refreshExpiresIn } = getTokens(tokenPayload);
      
      await refreshSessions.update({
        refreshToken: newRefreshToken,
        updatedAt: Date.now(),
        expiresIn: refreshExpiresIn
      },{
        where: {
          id: session.id
        }
      });

      return res.status(200).json({newAccessToken, newRefreshToken, expiresIn});
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  },

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