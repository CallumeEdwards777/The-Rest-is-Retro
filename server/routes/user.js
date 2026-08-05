const router = require("express").Router();
const { User } = require("../models");
const { signToken, authMiddleware } = require("../utils/auth");

const SAFE_USER_ATTRIBUTES = { exclude: ["password"] };

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.getOne(req.user.id, SAFE_USER_ATTRIBUTES);
    if (!user) {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(200).json({ userData: user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const userData = await User.getOne(req.params.id, SAFE_USER_ATTRIBUTES);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ userData });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: SAFE_USER_ATTRIBUTES });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email, and password are required" });
    }

    const userData = await User.create(req.body);
    const token = signToken(userData);
    const safeUser = userData.toJSON();
    delete safeUser.password;
    res.status(201).json({ token, userData: safeUser });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).json({ message: "Error creating user", error: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const [affectedRows] = await User.update(req.body, {
      where: { id: req.params.id },
    });

    if (affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.getOne(req.params.id, SAFE_USER_ATTRIBUTES);
    res.status(200).json({ userData: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const userData = await User.findOne({ where: { email } });
    if (!userData) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const validPassword = await userData.checkPassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = signToken(userData);
    const safeUser = userData.toJSON();
    delete safeUser.password;
    res.status(200).json({ token, userData: safeUser });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error during login", error: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.status(204).end();
});

module.exports = router;