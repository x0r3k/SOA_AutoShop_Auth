const createError = require('http-errors');
const { users, sequelize } = require('../../models');
  
module.exports = {
    getUsers: async (req, res, next) => {
        try {
            const userList = await users.findAll();
            return res.status(200).json({ userList });
        } catch (error) {
            return next(createError(formErrorObject(MAIN_ERROR_CODES.SYSTEM_ERROR, 'Something went wrong, please try again')));
        }
    },
}  