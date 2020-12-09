'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Podcast extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Podcast.belongsTo(models.Podcaster, {foreignKey: "podcasterId"})
    }
  };
  Podcast.init({
    podcasterId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    genreId: DataTypes.INTEGER,
    rssFeedUrl: DataTypes.STRING,
    dynamoUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Podcast',
  });
  return Podcast;
};