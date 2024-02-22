const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    //db_name , user_name ,passwrd ,  config
    dialect: process.env.DATABASE_DIALECT,
    //host: process.env.DATABASE_HOST,
  }
);

module.exports = sequelize;
