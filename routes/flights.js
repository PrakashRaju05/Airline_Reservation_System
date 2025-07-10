
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/flights.json");

router.get("/", (req, res) => {
  const flights = JSON.parse(fs.readFileSync(filePath));
  res.json(flights);
});

router.get("/:id", (req, res) => {
  const flights = JSON.parse(fs.readFileSync(filePath));
  const flight = flights.find(f => f.id === req.params.id);
  flight ? res.json(flight) : res.status(404).send("Flight not found");
});

module.exports = router;
