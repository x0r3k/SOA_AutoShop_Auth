module.exports = (sequelize, DataType) => {
  const refreshSessionsTable = sequelize.define('refreshSessions', {
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
    refreshToken: {
      type: DataType.STRING(500),
      allowNull: false,
      unique: true
    },
    userAgent: {
      type: DataType.STRING(200),
      allowNull: false,
    },
    fingerprint: {
      type: DataType.TEXT,
      allowNull: false,
    },
    expiresIn: {
      type: DataType.BIGINT,
      allowNull: false,
    },
    createdAt: {
      type: DataType.BIGINT,
      allowNull: false,
    },
    updatedAt: {
      type: DataType.BIGINT,
      allowNull: false,
    }
  }, {
    freezeTableName: true
  });

  return refreshSessionsTable;
};
