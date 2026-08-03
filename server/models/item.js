const { Model, DataTypes, Sequelize } = require("sequelize");

const sequelize = require("../config/connection");

class Item extends Model {}

Item.init(
  {
    item_id: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      seller_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
  },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    era: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "item",
  }
);

module.exports = Item;
