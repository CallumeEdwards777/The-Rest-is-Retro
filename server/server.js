// Import required packages
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const sequelize = require("./config/connection");
const routes = require("./routes");

// Initialize Express application
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for any paths from the client
app.use(cors());

const PORT = process.env.PORT || 3001;

// has the --rebuild parameter been passed as a command line param?
const rebuild = process.argv[2] === "--rebuild";

// Serve static files (item images) from the client's public directory
app.use(express.static(path.join(__dirname, "../client/public")));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// In development the React client runs on Vite (port 5173); this server only provides the API
app.get("/", (req, res) => {
  res.json({ message: "The Rest Is Retro API is running. The client runs on Vite in dev (http://localhost:5173)." });
});

// Add routes
app.use(routes);

// Sync database
sequelize.sync({ force: rebuild }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
