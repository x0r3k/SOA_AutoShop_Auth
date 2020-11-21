const jwt = require('jsonwebtoken');
const { users, userSessions } = require("../sequelize/models");
const { JSONWebTokens } = require("../configs/jwtConfig"); 

function getTokens(payload) {
  try {
    const accessToken = generateTokens(payload, 'access');
    const refreshToken = generateTokens(payload, 'refresh');
    // return updateTokens(payload.userId, accessToken, refreshToken)
    //   .then(() => ({
    //     accessToken,
    //     refreshToken,
    //   }))
    //   .catch(error => ({
    //     error
    //   }));
    console.log("1", accessToken, "\n2", refreshToken);
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
    token = jwt.sign(payload, secret, options);
  } else return;
  return token;
}

// async function updateTokens(userId, refreshToken) {
//   try {
//     const user = await users.findOne({
//       where: {
//         Id: userId
//       },
//       include: {
//         nodel: userSessions
//       }
//     });
//     user.Token = accessToken;
//     user.RefreshToken = refreshToken;
//     await user.save();
//   } catch (error) {
//     console.log(error);
//   }
// }

module.exports = {
  getTokens
}