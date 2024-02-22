const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ListItem = sequelize.define("listItem", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  }
});

module.exports = ListItem;