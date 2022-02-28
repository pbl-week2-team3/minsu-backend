'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init({
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    nickname: DataTypes.STRING,
    password: DataTypes.STRING,
    profile_img_url: DataTypes.STRING,
    createdAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'users',
  });

  users.associate = models => {
    users.hasMany(models.posts, {
      foreignKey: 'user_id',
      sourceKey: 'id'
    })

    users.hasMany(models.likes, {
      foreignKey: 'user_id',
      sourceKey: 'id'
    })
  }

  return users;
};