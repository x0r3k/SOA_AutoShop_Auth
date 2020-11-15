module.exports = (sequelize, DataType) => {
  const usersTable = sequelize.define('users', {
    Id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name:{
      type: DataType.STRING(100),
      allowNull: false,
      unique: true,
    },
    Gender:{
      type: DataType.ENUM('0', '1'),
      allowNull: false,
    },
  }, {
    freezeTableName: true,
  });

  return usersTable;
};
