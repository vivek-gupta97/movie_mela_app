const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Movie = sequelize.define("movie", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: { type: Sequelize.STRING, allowNull: false },
  storyLine: { type: Sequelize.TEXT, allowNull: false },
  length: { type: Sequelize.DECIMAL },
  imageUrl: Sequelize.STRING,
  genre: Sequelize.STRING,
  cast : Sequelize.STRING,
  releaseDate : Sequelize.DATEONLY
});

module.exports = Movie;
