const express = require("express");
const router = express.Router();
const { isAuthenticated, isManager } = require("../middleware/auth");
const moment = require("moment");
const stockModel = require("../models/stockModel");

// ================= Stock page =================
router.get("/stock", isAuthenticated, isManager, (req, res) => {
  res.render("stock", { title: "Stock Page" });
});

// ================= Add Stock =================
router.post("/stock", isAuthenticated, isManager, async (req, res) => {
  try {
    const { productName, productType, totalQuantity, availableQuantity, quality, costPrice, sellingPrice, supplierName, supplierContact, date } = req.body;

    if (!productName || !totalQuantity || !costPrice) {
      return res.status(400).send("Product Name, Total Quantity, and Cost Price are required");
    }

    const stockData = {
      productName,
      productType,
      totalQuantity: parseInt(totalQuantity) || 0,
      availableQuantity: parseInt(availableQuantity) || parseInt(totalQuantity) || 0,
      quality,
      costPrice: parseFloat(costPrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      supplierName,
      supplierContact,
      date: date || new Date()
    };

    const stock = new stockModel(stockData);
    await stock.save();

    res.redirect("/stocklist");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding stock");
  }
});

// ================= Stock List =================
router.get("/stocklist", isAuthenticated, async (req, res) => {
  try {
    const items = await stockModel.find().sort({ createdAt: -1 });
    res.render("stocktable", { items, moment });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to get stock data");
  }
});

// ================= Edit Stock =================
router.get("/editstock/:id", isAuthenticated, isManager, async (req, res) => {
  try {
    const item = await stockModel.findById(req.params.id);
    if (!item) return res.status(404).send("Product not found");
    res.render("editstock", { item });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
});

router.post("/editstock/:id", isAuthenticated, isManager, async (req, res) => {
  try {
    const { productName, productType, totalQuantity, availableQuantity, quality, costPrice, sellingPrice, supplierName, supplierContact, date } = req.body;

    const updatedData = {
      productName,
      productType,
      totalQuantity: parseInt(totalQuantity) || 0,
      availableQuantity: parseInt(availableQuantity) || parseInt(totalQuantity) || 0,
      quality,
      costPrice: parseFloat(costPrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      supplierName,
      supplierContact,
      date: date || new Date()
    };

    await stockModel.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });

    res.redirect("/stocklist");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating stock");
  }
});

// ================= Delete Stock =================
router.post("/deletestock/:id", isAuthenticated, isManager, async (req, res) => {
  try {
    await stockModel.findByIdAndDelete(req.params.id);
    res.redirect("/stocklist");
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to delete stock");
  }
});

module.exports = router;
