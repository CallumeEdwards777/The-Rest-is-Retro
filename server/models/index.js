const Category = require("./category");
const User = require("./user");
const Item = require("./item");

Item.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

Category.hasMany(Item, {
  foreignKey: "category_id",
  as: "items",
});

User.hasMany(Item, {
  foreignKey: "seller_id",
  as: "sold_items",
  onDelete: "CASCADE",
});

Item.belongsTo(User, {
  foreignKey: "seller_id",
  as: "seller",
});

module.exports = {
  Category,
  User,
  Item,
};
