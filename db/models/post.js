'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'UserId' });
      Post.hasMany(models.Comment, { foreignKey: 'PostId', as: 'comments' });
    }
  }

  Post.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      category: DataTypes.STRING,
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Post',
    }
  );
  return Post;
};