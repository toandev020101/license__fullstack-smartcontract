'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class License extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      License.belongsTo(models.User, { foreignKey: 'createdBy', targetKey: 'id', as: 'userData' });
    }
  }
  License.init(
    {
      image: DataTypes.STRING,
      imageName: DataTypes.STRING,
      authorName: DataTypes.STRING,
      authorPhoneNumber: DataTypes.STRING,
      authorEmail: DataTypes.STRING,
      authorAddress: DataTypes.STRING,
      price: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'License',
    },
  );
  return License;
};
