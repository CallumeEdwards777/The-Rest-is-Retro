const app = require("express").Router();
const { authMiddleware } = require("../utils/auth");

// import the models
const { Category } = require("../models/index");

app.post("/", authMiddleware, async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ message: "category_name is required" });
    }
    const category = await Category.create({ category_name });
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
});

app.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ message: "Error retrieving categories", error: error.message });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error retrieving category:", error);
    res.status(500).json({ message: "Error retrieving category", error: error.message });
  }
});

app.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ message: "category_name is required" });
    }
    const [affectedRows] = await Category.update(
      { category_name },
      { where: { id: req.params.id } },
    );
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    const updatedCategory = await Category.findByPk(req.params.id);
    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
});

app.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const affectedRows = await Category.destroy({ where: { id: req.params.id } });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
});

module.exports = app;