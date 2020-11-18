module.exports = (sequelize, DataType) => {
  const userRolesTable = sequelize.define('userRoles', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fkUserId: {
      type: DataType.STRING(100),
      allowNull: false,
      unique: true
    },
    fkRoleId: {
      type: DataType.STRING(15),
      allowNull: false,
      unique: true
    }
  }, {
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['fkRoleId', 'fkUserId'],
      },
    ],
  });

  return userRolesTable;
};
