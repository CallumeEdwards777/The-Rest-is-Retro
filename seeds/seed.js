const sequelize = require("../config/connection");

const bcrypt = require("bcrypt");

const { item, category, user } = require("../models");

const itemsData = require("./items.json");

const usersData = require("./users.json");

const categoriesData = require("./categories.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const categories = await category.bulkCreate(categoriesData);

    const users = await user.bulkCreate(usersData, {
    individualHooks: true,
    returning: true,
  });

  const items = await item.bulkCreate(itemsData);

  process.exit(0);
};

seedDatabase();

