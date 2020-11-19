module.exports = (sequelize, DataType) => {
  const usersTable = sequelize.define('users', {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataType.STRING(73),
      allowNull: false,
    },
    name:{
      type: DataType.STRING(20),
      allowNull: false,
    },
    lastname: {
      type: DataType.STRING(30),
      allowNull: true,
    },
    fullname:{
      type: DataType.STRING(50),
      allowNull: false,
    },
    gender: {
      type: DataType.ENUM('M', 'F', 'NB'),
      allowNull: false,
    },
    birthdate: {
      type: DataType.BIGINT,
      allowNull: false,
    },
    city: {
      type: DataType.STRING(50),
      allowNull: false
    }
  }, {
    freezeTableName: true,
  });

  usersTable.associate = (models) => {
    usersTable.hasMany(models.userRoles, { as: 'UserRoles', foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true, onDelete: 'cascade'});
    usersTable.belongsToMany(models.roles, {
      foreignKey: { name: 'fkUserId', allowNull: false }, 
      otherKey: { name: 'fkRoleId', allowNull: false }, 
      foreignKeyConstraint: true, 
      through: models.userRoles
    });

    usersTable.hasMany(models.refreshSessions, 
      { foreignKey: { name: 'fkUserId', allowNull: false }, foreignKeyConstraint: true, onDelete: 'cascade'}
    );
  }

  return usersTable;
};
