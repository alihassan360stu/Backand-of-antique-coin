const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

const database = "test";
const config = {
  host: "localhost",
  user: "devuser",
  password: "password123",
  port: 3306,
};

const db = {};

const dataBaseInitialize = async () => {
  try {
    // 1️⃣ create database if not exists
    const connection = await mysql.createConnection(config);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log("Connection successfully");

    // 2️⃣ sequelize connection
    const sequelize = new Sequelize(database, config.user, config.password, {
      host: config.host,
      dialect: "mysql",
      port: config.port,
      logging: false,
    });

    // 3️⃣ load models
    const User = require("../model/User")(sequelize);
    const AntiqueCoins = require("../model/antique_coins")(sequelize);
    const Addcart = require("../model/add_cart")(sequelize);

    // 4️⃣ relations

    // User → Antique Coins (SELL)
    User.hasMany(AntiqueCoins, {
      foreignKey: "user_id",
      as: "sellRequests",
    });

    AntiqueCoins.belongsTo(User, {
      foreignKey: "user_id",
      as: "user",
    });

    // Sell Coin Requests → Addcart (ONE TO ONE)
    AntiqueCoins.hasOne(Addcart, {
      foreignKey: "card_id",
      as: "addcart",
      onDelete: "CASCADE",
    });

    Addcart.belongsTo(AntiqueCoins, {
      foreignKey: "card_id",
      as: "card",
    });

    // 5️⃣ sync
    await sequelize.sync({ alter: true });
    console.log("Sequelize models synced.");

    // 6️⃣ export
    db.User = User;
    db.AntiqueCoins = AntiqueCoins;
    db.Addcart = Addcart;
    db.sequelize = sequelize;

  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};

dataBaseInitialize();

module.exports = db;
