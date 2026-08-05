const sequelize = require("../config/connection");

const bcrypt = require("bcrypt");

const { Item, Category, User } = require("../models");

const itemsData = require("./items.json");

const usersData = require("./user.json");

const categoriesData = require("./categories.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const categories = await Category.bulkCreate(categoriesData);

  // Create users one at a time so ids always match user.json order —
  // bulkCreate with individualHooks races the bcrypt hooks and shuffles ids
  for (const userData of usersData) {
    await User.create(userData);
  }

  const items = await Item.bulkCreate(itemsData);

  process.exit(0);
};

seedDatabase();

