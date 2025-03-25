'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if needed
      // Example: User.hasMany(models.Book);
    }
  }

  User.init(
    {
      googleId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: true, // Optional, as it may not always be available
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, as it may not always be available
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true, // Enable createdAt and updatedAt fields
    }
  );

  return User;
};