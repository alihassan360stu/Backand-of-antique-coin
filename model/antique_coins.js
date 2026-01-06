const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const SellCoinRequest = sequelize.define(
    "antique_coins",
    {
      // ===== Foreign Key =====
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // ===== User Info =====
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cnic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // ===== Coin Details =====
      coin_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expected_rates: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      why_selling: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // ===== Address =====
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // ===== File Upload =====
      file_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "sell_coin_requests",
      timestamps: true,
    }
  );

  return SellCoinRequest;
};
