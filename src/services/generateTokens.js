const jwt = require('jsonwebtoken');
const { users, userSessions } = require("../sequelize/models");
const { JSONWebTokens } = require("../configs/jwtConfig"); 

function getTokens(payload) {
  try {
    const newAccessToken = generateTokens(payload, 'access');
    const newRefreshToken = generateTokens(payload, 'refresh');
    const expiresIn = Date.now() + JSONWebTokens.tokens.access.expiresInMs;
    const refreshExpiresIn = Date.now() + JSONWebTokens.tokens.refresh.expiresInMs;
    return {newAccessToken, newRefreshToken, expiresIn, refreshExpiresIn};
  } catch (error) {
    console.log(error);
  }
}

function generateTokens(payload, tokenType) {
  let token = null;
  const secret = JSONWebTokens.secret;
  const options = { expiresIn: JSONWebTokens.tokens[tokenType].expiresIn }
  if (tokenType === 'access') {
    token = jwt.sign({...payload, tokenType}, secret, options);
  } else if (tokenType === 'refresh') {
    token = jwt.sign({}, secret, options);
  } else return;
  return token;
}

module.exports = {
  getTokens
}