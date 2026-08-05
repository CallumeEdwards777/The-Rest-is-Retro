#!/usr/bin/env node

const { sequelize } = require("../models/index");
const Item = require("../models/item");

(async () => {
  try {
    console.log("Clearing image URLs...");

    const [affectedRows] = await Item.update(
      { image_url: null },
      { where: {} }
    );

    console.log(`✓ Cleared ${affectedRows} items`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
})();
