'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  likes.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user_id: DataTypes.STRING,
    post_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'likes',
  });

  likes.associate = models => {
    likes.belongsTo(models.posts, {
      foreignKey: "post_id",
      sourceKey: 'id',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION'
    });

    likes.belongsTo(models.users, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION'
    });
  };

  return likes;
};