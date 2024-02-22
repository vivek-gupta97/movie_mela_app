const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const WatchedMovie = sequelize.define("watched-movie", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  }
});

module.exports = WatchedMovie;