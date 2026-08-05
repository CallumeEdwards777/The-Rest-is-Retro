const app = require("express").Router();

// import the models
const { Item, SavedItem } = require("../models/index");
const { authMiddleware } = require("../utils/auth");

// Route to get all saved items for the logged-in user
app.get("/", authMiddleware, async (req, res) => {
  try {
    const savedItems = await SavedItem.findAll({ where: { user_id: req.user.id } });
    const savedIds = savedItems.map((saved) => saved.item_id);
    const items = await Item.findAll({ where: { id: savedIds } });

    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving saved items", error: error.message });
  }
});

// Route to save an item for the logged-in user
app.post("/:itemId", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await SavedItem.findOrCreate({
      where: { user_id: req.user.id, item_id: req.params.itemId },
    });

    res.status(200).json({ saved: true });
  } catch (error) {
    res.status(500).json({ message: "Error saving item", error: error.message });
  }
});

// Route to unsave an item for the logged-in user
app.delete("/:itemId", authMiddleware, async (req, res) => {
  try {
    await SavedItem.destroy({ where: { user_id: req.user.id, item_id: req.params.itemId } });

    res.status(200).json({ saved: false });
  } catch (error) {
    res.status(500).json({ message: "Error unsaving item", error: error.message });
  }
});

// export the router
module.exports = app;
