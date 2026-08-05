const multer = require("multer");
const path = require("path");

// Extension comes from the accepted mimetype, never from the client's filename —
// otherwise "pwn.html" declared as image/png would be saved and served as HTML.
const EXTENSION_FOR_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + EXTENSION_FOR_MIME[file.mimetype]);
  },
});

const fileFilter = (req, file, cb) => {
  if (EXTENSION_FOR_MIME[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
