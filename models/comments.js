'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  comments.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    post_id: DataTypes.INTEGER,
    user_id: DataTypes.STRING,
    text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'comments',
  });
  return comments;
};