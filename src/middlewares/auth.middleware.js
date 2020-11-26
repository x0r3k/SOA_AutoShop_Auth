const jwt = require('jsonwebtoken');
const { JSONWebTokens } = require('../configs/jwtConfig');
const { users } = require("../sequelize/models");
const createError = require('http-errors');
const { formErrorObject, MAIN_ERROR_CODES } = require('../services/errorHandling');

async function authUser(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    if(!req.headers.authorization) return next(createError(formErrorObject(MAIN_ERROR_CODES.UNAUTHORIZED, 'Authorization header is not recognized')));
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return next(createError(formErrorObject(MAIN_ERROR_CODES.UNAUTHORIZED, 'Authorization header is in incorrect format')));
    
    const tokenPayload = jwt.verify(token, JSONWebTokens.secret);

    if(!tokenPayload) return next(createError(formErrorObject(MAIN_ERROR_CODES.TOKEN_ERROR, 'Cannot get token payload')));

    //Checking of access token (and storing of it in Db) is useless
    const user = await users.findByPk(tokenPayload.userId);
    if(!user) return next(createError(formErrorObject(MAIN_ERROR_CODES.ELEMENT_NOT_FOUND, 'User not found by token payload')));
    
    req.user = tokenPayload;
    next();
  } catch (error) {
    console.log(error);
    return next(createError(formErrorObject(MAIN_ERROR_CODES.TOKEN_ERROR, 'Token is not valid', error)));
  }
}

function authRole(role) {
  return function(req, res, next) {
    try {
      const user = req.user;
      let rolesCheck = role.map(item => user.userRoles.includes(item)).includes(false);
      if(rolesCheck) return next(createError(formErrorObject(MAIN_ERROR_CODES.FORBIDDEN, 'Uesr has not necessary roles')));
      next();
    } catch (error) {
      console.log(error);
      return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
    }
  }
}

module.exports = {
  authUser,
  authRole
}
