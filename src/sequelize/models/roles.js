module.exports = (sequelize, DataType) => {
  const rolesTable = sequelize.define('roles', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roleName: {
      type: DataType.STRING(100),
      allowNull: false,
      unique: true
    },
    roleCode: {
      type: DataType.STRING(15),
      allowNull: false,
      unique: true
    }
  }, {
    freezeTableName: true,
  });

  return rolesTable;
};
