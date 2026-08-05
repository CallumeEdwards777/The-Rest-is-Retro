#!/usr/bin/env node

const { sequelize } = require("../models/index");
const Item = require("../models/item");

(async () => {
  try {
    console.log("Fixing image URLs...");

    // Get all items with image_url
    const items = await Item.findAll({
      where: { image_url: { [require("sequelize").Op.not]: null } }
    });

    console.log(`Found ${items.length} items with image URLs`);

    let updated = 0;
    for (const item of items) {
      if (!item.image_url.startsWith("http")) {
        // Convert relative URL to absolute
        const absoluteUrl = `http://localhost:3001${item.image_url}`;
        await item.update({ image_url: absoluteUrl });
        updated++;
      }
    }

    console.log(`✓ Updated ${updated} items with absolute URLs`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
})();
