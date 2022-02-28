'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  posts.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user_id: DataTypes.STRING,
    contents: DataTypes.STRING,
    img: DataTypes.STRING,
    createdAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'posts',
  });

  posts.associate = models => {
    posts.hasMany(models.likes, {
      foreignKey: 'post_id',
      sourceKey: 'id'
    });

    posts.belongsTo(models.users, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      onDelete: 'CASCADE'
    })
  }

  return posts;
};

