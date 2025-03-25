'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Purchase.belongsTo(models.User, { foreignKey: 'userId' });
      Purchase.belongsTo(models.Book, { foreignKey: 'bookId' });
    }
  }
  Purchase.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Books',
        key: 'id'
      }
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['pending', 'paid', 'failed', 'expire', 'cancel']]
      },
      defaultValue: 'pending'
    },
    grossAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.00
      },
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Purchase',
  });
  return Purchase;
};