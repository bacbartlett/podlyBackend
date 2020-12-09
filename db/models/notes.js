'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Note.belongsTo(models.Researcher, {foreignKey:"researcherId"})
      Note.belongsTo(models.Transcript, {foreignKey: "transcriptId"})
    }
  };
  Note.init({
    researcherId: DataTypes.INTEGER,
    transcriptId: DataTypes.INTEGER,
    beginningTime: DataTypes.INTEGER,
    endingTime: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Note',
  });
  return Note;
};