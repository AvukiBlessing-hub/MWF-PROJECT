const express = require("express");
const router = express.Router();
const { isAuthenticated, isManager } = require("../middleware/auth");
const stockModel = require("../models/stockModel");
const salesModel = require("../models/salesModel");
const moment = require("moment");

// ================= Sales Page =================
router.get("/sales", isAuthenticated, async (req, res) => {
  try {
    const stocks = await stockModel.find().lean();
    res.render("sales", { stocks, currentUser: req.user });
  } catch (err) {
    console.error("Error loading sales page:", err);
    res.status(500).send("Error loading sales page");
  }
});

// ================= Add Sale =================
router.post("/sales", isAuthenticated, async (req, res) => {
  try {
    const { customerName, stockId, quantity, quality, costPrice, paymentMethod, transportCheck } = req.body;

    if (!customerName || !stockId || !quantity || !costPrice) {
      return res.status(400).send("Required fields missing");
    }

    const stockItem = await stockModel.findById(stockId);
    if (!stockItem) return res.status(404).send("Stock not found");

    const totalPrice = Number(costPrice) * Number(quantity);
    const transportFee = transportCheck ? totalPrice * 0.05 : 0;

    const newSale = new salesModel({
      customerName,
      productName: stockItem.productName,
      productType: stockItem.productType,
      quantity: Number(quantity),
      quality,
      costPrice: Number(costPrice),
      totalPrice: totalPrice + transportFee,
      transportFee: !!transportCheck,
      paymentMethod,
      Attendant: req.user._id,
      date: new Date(),
    });

    await newSale.save();
    res.redirect("/saleslist");
  } catch (err) {
    console.error("Error adding sale:", err);
    res.status(500).send("Error adding sale");
  }
});

// ================= Sales List =================
router.get("/saleslist", isAuthenticated, async (req, res) => {
  try {
    const items = await salesModel.find().populate("Attendant").lean();
    res.render("salestable", { items, currentUser: req.user });
  } catch (err) {
    console.error("Error fetching sales list:", err);
    res.status(500).send("Error fetching sales list");
  }
});

// ================= Edit Sale =================
router.get("/editsales/:id", isAuthenticated, async (req, res) => {
  try {
    const item = await salesModel.findById(req.params.id).populate("Attendant").lean();
    if (!item) return res.status(404).send("Sale not found");

    res.render("editsales", { item, currentUser: req.user });
  } catch (err) {
    console.error("Error loading edit sale form:", err);
    res.status(500).send("Error loading edit sale form");
  }
});

router.post("/editsales/:id", isAuthenticated, async (req, res) => {
  try {
    const { customerName, productType, productName, quantity, quality, costPrice, paymentMethod, transportCheck } = req.body;

    const totalPrice = Number(costPrice) * Number(quantity);
    const transportFee = transportCheck ? totalPrice * 0.05 : 0;

    await salesModel.findByIdAndUpdate(req.params.id, {
      customerName,
      productType,
      productName,
      quantity: Number(quantity),
      quality,
      costPrice: Number(costPrice),
      totalPrice: totalPrice + transportFee,
      transportFee: !!transportCheck,
      paymentMethod,
    });

    res.redirect("/saleslist");
  } catch (err) {
    console.error("Error updating sale:", err);
    res.status(500).send("Error updating sale");
  }
});

// ================= Delete Sale =================
router.post("/deletesales/:id", isAuthenticated, isManager, async (req, res) => {
  try {
    await salesModel.findByIdAndDelete(req.params.id);
    res.redirect("/saleslist");
  } catch (err) {
    console.error("Error deleting sale:", err);
    res.status(500).send("Error deleting sale");
  }
});

// ================= Receipt =================
router.get("/receipt/:id", isAuthenticated, async (req, res) => {
  try {
    const sale = await salesModel.findById(req.params.id).populate("Attendant").lean();
    if (!sale) return res.status(404).send("Sale not found");

    res.render("receipt", { sale, currentUser: req.user, moment });
  } catch (err) {
    console.error("Error generating receipt:", err);
    res.status(500).send("Error generating receipt");
  }
});

// ================= Sale Report =================
router.get("/report/:id", isAuthenticated, async (req, res) => {
  try {
    const sale = await salesModel.findById(req.params.id).populate("Attendant").lean();
    if (!sale) return res.status(404).send("Sale not found");

    res.render("report", { sale, currentUser: req.user, moment });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).send("Error generating report");
  }
});

module.exports = router;
