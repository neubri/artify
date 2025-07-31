"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Item has many Bids
      Item.hasMany(models.Bid, {
        foreignKey: "itemId",
        as: "bids",
      });
    }

    // Instance method to get current highest bid
    async getCurrentPrice() {
      const highestBid = await sequelize.models.Bid.findOne({
        where: { itemId: this.id },
        order: [["amount", "DESC"]],
        limit: 1,
      });

      return highestBid ? highestBid.amount : this.startingPrice;
    }

    // Instance method to get bid count
    async getBidCount() {
      return await sequelize.models.Bid.count({
        where: { itemId: this.id },
      });
    }
  }

  Item.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Item name is required",
          },
          len: {
            args: [3, 255],
            msg: "Item name must be between 3 and 255 characters",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      startingPrice: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Starting price is required",
          },
          min: {
            args: [0],
            msg: "Starting price must be a positive number",
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: {
            msg: "Must be a valid URL",
          },
        },
      },
      isSold: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: {
            msg: "Must be a valid date",
          },
          isAfter: {
            args: new Date().toISOString(),
            msg: "End time must be in the future",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Item",
      tableName: "items",
      timestamps: true,
    }
  );

  return Item;
};
