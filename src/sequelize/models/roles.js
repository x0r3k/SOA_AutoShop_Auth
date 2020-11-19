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

  rolesTable.associate = (models) => {
    rolesTable.hasMany(models.userRoles, { as: 'UserRoles', foreignKey: { name: 'fkRoleId', allowNull: false }, foreignKeyConstraint: true });
    rolesTable.belongsToMany(models.users, {
      foreignKey: { name: 'fkRoleId', allowNull: false }, 
      otherKey: { name: 'fkUserId', allowNull: false }, 
      foreignKeyConstraint: true, 
      through: models.userRoles,
    });
  };


  return rolesTable;
};
