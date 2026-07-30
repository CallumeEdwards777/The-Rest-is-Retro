const app = require("express").Router();

// import the models
const { Item } = require("../models/index");

// Route to add a new post
app.post("/", async (req, res) => {
  try {
    console.log("Adding new post:", req.body);
    const { title, content, description, postedBy } = req.body;
    const item = await Item.create({ title, content, description, postedBy });

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
    const { title, content, postedBy } = req.body;
    const item = await Item.update(
      { title, content, postedBy },
      { where: { id: req.params.id } },
    );
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error updating post" });
  }
});

// Route to delete a post
app.delete("/:id", async (req, res) => {
  try {
    const item = await Item.destroy({ where: { id: req.params.id } });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});

// export the router
module.exports = app;
