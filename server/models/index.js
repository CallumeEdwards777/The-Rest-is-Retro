const Post = require("./item");
const Category = require("./category");
const User = require("./user");
const Item = require("./item");

Post.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

Category.hasMany(Post, {
  foreignKey: "categoryId",
  as: "posts",
});

User.hasMany(Post, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = {
  Post,
  Category,
  User,
  Item,
};
