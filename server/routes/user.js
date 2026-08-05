const router = require("express").Router();
const { Op } = require("sequelize");
const { User } = require("../models");
const { signToken, authMiddleware } = require("../utils/auth");

const SAFE_USER_ATTRIBUTES = { exclude: ["password"] };

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: SAFE_USER_ATTRIBUTES,
    });
    if (!user) return res.status(401).json({ message: "Token expired" });
    return res.status(200).json({ user });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/:id", async (req, res) => {
  console.log("looking for user", req.params.id);
  try {
    const userData = await User.findByPk(req.params.id, {
      attributes: SAFE_USER_ATTRIBUTES,
    });

    if (!userData) {
      res.status(404).json({ message: "No User found with this id" });
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: SAFE_USER_ATTRIBUTES });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    const token = signToken(userData);
    const safeUser = userData.toJSON();
    delete safeUser.password;
    res.status(200).json({ token, userData: safeUser });
  } catch (err) {
    res.status(400).json(err);
  }
});


router.put("/:id", async (req, res) => {
  try {
    const userData = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!userData) {
      res.status(404).json({ message: "No User found with this id" });
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    // Accept either username or email in the "email" field
    const login = req.body.email;
    const userData = await User.findOne({
      where: { [Op.or]: [{ email: login }, { username: login }] },
    });
    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const token = signToken(userData);
    const safeUser = userData.toJSON();
    delete safeUser.password;
    res.status(200).json({ token, userData: safeUser });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  res.status(204).end();
});

module.exports = router;