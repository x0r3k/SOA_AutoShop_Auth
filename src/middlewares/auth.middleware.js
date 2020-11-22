const jwt = require('jsonwebtoken');
const { JSONWebTokens } = require('../configs/jwtConfig');
const { users } = require("../sequelize/models");

async function authUser(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    if(!req.headers.authorization) return res.status(401).json({ message: 'Authorization header is not recognized' });
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({ message: 'Authorization header is in incorrect format' });
    
    const tokenPayload = jwt.verify(token, JSONWebTokens.secret);

    if(!tokenPayload) return res.status(401).json({ message: 'Cannot get token payload' });

    //Checking of access token (and storing of it in Db) is useless
    const user = await users.findByPk(tokenPayload.userId);
    if(!user) return res.status(400).json({ message: 'User not found by token payload'});
    
    req.user = tokenPayload;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid', error });
  }
}

// function authRole(role) {
//   return (req, res, next) => {
//     if (!req.user.roles.includes(role)){
//       res.status(403).json({ message: 'Forbidden' });
//     }
//     next();
//   }
// }

module.exports = {
  authUser,
//   authRole
}
