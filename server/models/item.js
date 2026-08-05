const { Model, DataTypes, Sequelize } = require("sequelize");

const sequelize = require("../config/connection");

class Item extends Model {}

Item.init(
  {
    item_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    era: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price_cents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "verified",
    },
    seller_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "category",
        key: "id",
      },
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
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
