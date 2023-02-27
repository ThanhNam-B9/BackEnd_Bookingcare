const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "heroku_f91d81ae7bc5a2e",
  "be753cabfec398",
  "e94b712a",
  {
    host: "us-cdbr-east-06.cleardb.net",
    dialect: "mysql",
    logging: false,
  }
);

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connectDB;
