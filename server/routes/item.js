const app = require("express").Router();

// import the models
const { Item } = require("../models/index");
const {Op} = require("sequelize");
const { authMiddleware } = require("../utils/auth");
const upload = require("../utils/upload");

app.get("/search", async (req, res) => {
  try {
    const search = req.query.search;

const items = await Item.findAll({
  where: {
    [Op.or]: [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ],
  },
});

  res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error searching items" });
  }
});
// Route to add a new item (multipart form; optional "image" file; seller = logged-in user)
app.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { category_id, title, description, era, price, currency } = req.body;

    if (!title || !description || !era || !price) {
      return res.status(400).json({ message: "Missing required fields: title, description, era, price" });
    }

    // relative, so the photo still loads when the site is opened from another
    // device or a real domain rather than whatever host uploaded it
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const item = await Item.create({
      item_id: `TRR-NEW-${Date.now()}`,
      seller_id: req.user.id,
      category_id,
      title,
      description,
      era,
      price,
      currency: currency || "GBP",
      // "verified" is the shop's trust badge, never the seller's to award
      status: "pending_verification",
      image_url,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item", error: error.message });
  }
});

// Route to get all posts
app.get("/", async (req, res) => {
  try {
    const items = await Item.findAll();

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving posts", error });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving item", error: error.message });
  }
});

// Route to buy an item — marks it sold and returns an order reference
app.post("/:id/buy", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (item.status === "sold") {
      return res.status(400).json({ message: "This item has already been sold" });
    }
    if (String(item.seller_id) === String(req.user.id)) {
      return res.status(400).json({ message: "You can't buy your own listing" });
    }

    const [affected] = await Item.update(
      { status: "sold" },
      { where: { id: req.params.id, status: { [Op.ne]: "sold" } } }
    );
    if (affected === 0) {
      return res.status(400).json({ message: "This item has already been sold" });
    }

    const updatedItem = await Item.findByPk(req.params.id);

    res.json({
      item: updatedItem,
      order: {
        ref: `TRR-ORD-${String(updatedItem.id).padStart(4, "0")}`,
        buyer_id: req.user.id,
      },
    });
  } catch (error) {
    console.error("Error buying item:", error);
    res.status(500).json({ error: "Error buying item" });
  }
});

// Route to relist a sold item — resets it to pending verification (owner only)
app.post("/:id/relist", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (String(item.seller_id) !== String(req.user.id)) {
      return res.status(403).json({ message: "You can only relist your own listings" });
    }
    if (item.status !== "sold") {
      return res.status(400).json({ message: "Only sold items can be relisted" });
    }

    item.status = "pending_verification";
    await item.save();

    res.json(item);
  } catch (error) {
    console.error("Error relisting item:", error);
    res.status(500).json({ error: "Error relisting item" });
  }
});

// Route to update an item (multipart form; optional "image" file; owner only)
app.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const existing = await Item.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (String(existing.seller_id) !== String(req.user.id)) {
      return res.status(403).json({ message: "You can only edit your own listings" });
    }

    const { category_id, title, description, era, price, currency } = req.body;
    const updateData = { category_id, title, description, era, price, currency };

    if (req.file) {
      updateData.image_url = `/uploads/${req.file.filename}`;
    }

    await Item.update(updateData, { where: { id: req.params.id } });

    const updatedItem = await Item.findByPk(req.params.id);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error: error.message });
  }
});

// Route to delete an item (owner only)
app.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const existing = await Item.findByPk(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (String(existing.seller_id) !== String(req.user.id)) {
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    await Item.destroy({ where: { id: req.params.id } });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
});



// export the router
module.exports = app;
