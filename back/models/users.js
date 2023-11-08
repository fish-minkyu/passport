'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    userId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    nickname: {
      allowNull: true,
      type: DataTypes.STRING
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING
    },
    sessionId: {
      type: DataTypes.STRING
    },
    sessionData: {
      type: DataTypes.STRING
    },
    provider: {
      allowNull: false,
      type: DataTypes.ENUM('local', 'kakao', 'naver'),
      defaultValue: 'local'
    },
    snsId: {
      allowNull: true,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};