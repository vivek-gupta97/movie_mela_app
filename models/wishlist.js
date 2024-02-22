const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Wishlist = sequelize.define("wishlist", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  }
});

module.exports = Wishlist;
