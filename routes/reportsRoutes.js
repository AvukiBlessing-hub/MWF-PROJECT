const express = require("express");
const router = express.Router();

// import your models
const stockModel = require("../models/stockModel");
const salesModel = require("../models/salesModel");       // you must create this
const deliveryModel = require("../models/deliveryModel"); // you must create this

// Reports dashboard page
router.get("/reports", (req, res) => {
  res.render("reports", { title: "MWF Reports Dashboard" });
});

// API endpoint for Sales report
router.get("/reports/sales", async (req, res) => {
  try {
    const sales = await salesModel.find().sort({ $natural: -1 });
    res.json(sales); // send data as JSON
  } catch (error) {
    console.error("Error fetching sales report:", error.message);
    res.status(500).send("Unable to fetch sales report");
  }
});

// API endpoint for Stock report
router.get("/reports/stock", async (req, res) => {
  try {
    const stock = await stockModel.find().sort({ $natural: -1 });
    res.json(stock);
  } catch (error) {
    console.error("Error fetching stock report:", error.message);
    res.status(500).send("Unable to fetch stock report");
  }
});

// API endpoint for Delivery report
router.get("/reports/delivery", async (req, res) => {
  try {
    const deliveries = await deliveryModel.find().sort({ $natural: -1 });
    res.json(deliveries);
  } catch (error) {
    console.error("Error fetching delivery report:", error.message);
    res.status(500).send("Unable to fetch delivery report");
  }
});

module.exports = router;
