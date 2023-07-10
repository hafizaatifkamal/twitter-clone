const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
require('dotenv').config();
const app = express();
const db = mongoose.connection;

const port = process.env.PORT || 4000;
const DB = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);
app.get("/api", (req, res) => {
  res.send("Welcome to Twitter");
});

// Database connection
const connectToDb = () => {
  mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db.on("error", () => {
    console.log("DB Connection error");
  });
  db.on("open", () => {
    console.log("DB Connected");
  });
};

app.listen(port, () => {
  console.log(`Listening on the port ${port}`);
  connectToDb();
});

module.exports = app;