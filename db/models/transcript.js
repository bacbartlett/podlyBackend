'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transcript extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transcript.belongsTo(models.Podcast, {foreignKey: "podcastId"})
      Transcript.belongsTo(models.Transcriber, {foreignKey: "transcriberId"})
    }
  };
  Transcript.init({
    status: DataTypes.INTEGER,
    link: DataTypes.STRING,
    podcastId: DataTypes.INTEGER,
    transcriberId: DataTypes.INTEGER,
    dynamoUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transcript',
  });
  return Transcript;
};