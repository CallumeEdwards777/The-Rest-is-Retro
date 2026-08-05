const app = require("express").Router();
const upload = require("../utils/upload");

// import the models
const { Item } = require("../models/index");

app.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, era, price_cents, seller_id, category_id, status } = req.body;

    if (!title || !description || !era || !price_cents) {
      return res.status(400).json({ message: "Missing required fields: title, description, era, price_cents" });
    }

    const image_url = req.file ? `http://${req.get("host")}/uploads/${req.file.filename}` : null;

    const item = await Item.create({
      title,
      description,
      era,
      price_cents,
      seller_id,
      category_id,
      image_url,
      status: status || "verified"
    });
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item", error: error.message });
  }
});

app.get("/", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ message: "Error retrieving items", error: error.message });
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
    console.error("Error retrieving item:", error);
    res.status(500).json({ message: "Error retrieving item", error: error.message });
  }
});

app.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, era, price_cents, status, seller_id, category_id } = req.body;
    const updateData = { title, description, era, price_cents, status, seller_id, category_id };

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
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item", error: error.message });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const affectedRows = await Item.destroy({ where: { id: req.params.id } });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
});

module.exports = app;
