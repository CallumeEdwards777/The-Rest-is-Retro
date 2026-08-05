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
// Route to add a new item (multipart form; optional "image" file)
app.post("/", upload.single("image"), async (req, res) => {
  try {
    const { item_id, seller_id, category_id, title, description, era, price, currency, status } = req.body;

    if (!title || !description || !era || !price) {
      return res.status(400).json({ message: "Missing required fields: title, description, era, price" });
    }

    const image_url = req.file ? `http://${req.get("host")}/uploads/${req.file.filename}` : null;

    const item = await Item.create({
      item_id: item_id || `TRR-NEW-${Date.now()}`,
      seller_id,
      category_id,
      title,
      description,
      era,
      price,
      currency: currency || "GBP",
      status: status || "pending_verification",
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

    item.status = "sold";
    await item.save();

    res.json({
      item,
      order: {
        ref: `TRR-ORD-${String(item.id).padStart(4, "0")}`,
        buyer_id: req.user.id,
      },
    });
  } catch (error) {
    console.error("Error buying item:", error);
    res.status(500).json({ error: "Error buying item" });
  }
});

// Route to update an item (multipart form; optional "image" file)
app.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { item_id, seller_id, category_id, title, description, era, price, currency, status } = req.body;
    const updateData = { item_id, seller_id, category_id, title, description, era, price, currency, status };

    if (req.file) {
      updateData.image_url = `http://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const [affectedRows] = await Item.update(updateData, { where: { id: req.params.id } });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    const updatedItem = await Item.findByPk(req.params.id);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error: error.message });
  }
});

// Route to delete an item
app.delete("/:id", async (req, res) => {
  try {
    const affectedRows = await Item.destroy({ where: { id: req.params.id } });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
});



// export the router
module.exports = app;
