const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }, //id is set to be the primary key and it will automatically increment if not provided
  name: { type: Sequelize.STRING(50), unique: false, allowNull: false },
  email: { type: Sequelize.STRING, unique: true, allowNull: false },
  password: { type: Sequelize.STRING ,allowNull: false},
  genre:{type: Sequelize.STRING ,allowNull: false }
});

module.exports = User;