const sequelize = require("../config/connection");

const bcrypt = require("bcrypt");

const { Item, Category, User } = require("../models");

const itemsData = require("./items.json");

const usersData = require("./user.json");

const categoriesData = require("./categories.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const categories = await Category.bulkCreate(categoriesData);

    const users = await User.bulkCreate(usersData, {
    individualHooks: true,
    returning: true,
  });

  const items = await Item.bulkCreate(itemsData);

  process.exit(0);
};

seedDatabase();

