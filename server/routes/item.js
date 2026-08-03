const app = require("express").Router();

// import the models
const { Item } = require("../models/index");
const {Op} = require("sequelize");

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
// Route to add a new post
app.post("/", async (req, res) => {
  try {
    console.log("Adding new post:", req.body);
    const { itemId, sellerId, categoryId, title, description, era, price, currency, status } = req.body;
    const item = await Item.create({ itemId, sellerId, categoryId, title, description, era, price, currency, status });

    res.status(201).json(item);
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Error adding post" });
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
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving post" });
  }
});

// Route to update a post
app.put("/:id", async (req, res) => {
  try {
    const { itemId, sellerId, categoryId, title, description, era, price, currency, status } = req.body;
    const item = await Item.update(
      { itemId, sellerId, categoryId, title, description, era, price, currency, status },
      { where: { itemId: req.params.id } },
    );
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error updating post" });
  }
});

// Route to delete a post
app.delete("/:id", async (req, res) => {
  try {
    const item = await Item.destroy({ where: { itemId: req.params.id } });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});



// export the router
module.exports = app;
