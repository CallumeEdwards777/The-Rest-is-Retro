const { Model, DataTypes, Sequelize } = require("sequelize");

const sequelize = require("../config/connection");

class SavedItem extends Model {}

SavedItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "saved_item",
    indexes: [{ unique: true, fields: ["user_id", "item_id"] }],
  }
);

module.exports = SavedItem;
