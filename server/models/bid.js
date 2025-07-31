"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Bid belongs to User
      Bid.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // Bid belongs to Item
      Bid.belongsTo(models.Item, {
        foreignKey: "itemId",
        as: "item",
      });
    }
  }

  Bid.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Bid amount is required",
          },
          min: {
            args: [0],
            msg: "Bid amount must be a positive number",
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "items",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Bid",
      tableName: "bids",
      timestamps: true,
      hooks: {
        // Before creating a bid, validate that it's higher than current highest bid
        beforeCreate: async (bid) => {
          const item = await sequelize.models.Item.findByPk(bid.itemId);
          if (!item) {
            throw new Error("Item not found");
          }

          if (item.isSold) {
            throw new Error("Item is already sold");
          }

          const currentPrice = await item.getCurrentPrice();
          if (bid.amount <= currentPrice) {
            throw new Error(
              `Bid amount must be higher than current price: ${currentPrice}`
            );
          }
        },
      },
    }
  );

  return Bid;
};
