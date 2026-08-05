const { Item } = require("../models/index");
const router = require("express").Router();

const itemRoutes = require("./item");
const categoryRoutes = require("./category");
const userRoutes = require("./user");
const savedItemRoutes = require("./savedItem");

// create a default route for /api
router.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

router.use("/api/categories", categoryRoutes);
router.use("/api/items", itemRoutes);
router.use("/api/users", userRoutes);
router.use("/api/saved-items", savedItemRoutes);

module.exports = router;
