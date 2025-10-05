const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureManager } = require("../middleware/auth");
const moment = require("moment");

const stockModel = require("../models/stockModel");

// ================= Stock page =================
router.get("/stock", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("stock", { title: "Stock Page" });
});

// ================= Add Stock =================
router.post("/stock", ensureAuthenticated, ensureManager, async (req, res) => {
  console.log("=== STOCK ADDITION STARTED ===");
  console.log("User:", req.user);
  console.log("Request Body:", req.body);

  try {
    const { 
      productName, productType, totalQuantity, availableQuantity, 
      quality, costPrice, sellingPrice, supplierName, supplierContact, date 
    } = req.body;

    console.log("Extracted fields:", {
      productName, productType, totalQuantity, availableQuantity, quality, 
      costPrice, sellingPrice, supplierName, supplierContact, date
    });

    // Validate required fields
    if (!productName || !totalQuantity || !costPrice) {
      console.log("VALIDATION FAILED - Missing required fields");
      return res.status(400).send("Missing required fields: Product Name, Total Quantity, and Cost Price are required");
    }

    // Safe numeric parsing: fallback availableQuantity to totalQuantity if missing or invalid
    const parsedTotalQuantity = parseInt(totalQuantity);
    const parsedAvailableQuantity = parseInt(availableQuantity);

    const safeTotalQuantity = Number.isNaN(parsedTotalQuantity) ? 0 : parsedTotalQuantity;
    const safeAvailableQuantity = Number.isNaN(parsedAvailableQuantity) ? safeTotalQuantity : parsedAvailableQuantity;

    const stockData = {
      productName,
      productType,
      totalQuantity: safeTotalQuantity,
      availableQuantity: safeAvailableQuantity,
      quality,
      costPrice: Number.isNaN(parseFloat(costPrice)) ? 0 : parseFloat(costPrice),
      sellingPrice: Number.isNaN(parseFloat(sellingPrice)) ? 0 : parseFloat(sellingPrice),
      supplierName,
      supplierContact,
      date: date || new Date()
    };

    console.log("Stock data to save:", stockData);

    const stock = new stockModel(stockData);
    await stock.save();
    console.log("Stock saved to database");

    console.log("=== STOCK ADDITION COMPLETED SUCCESSFULLY ===");
    res.redirect("/stocklist");

  } catch (error) {
    console.error("ERROR IN STOCK ADDITION:", error);
    res.status(500).send(`Error adding stock: ${error.message}`);
  }
});

// ================= Get stock list =================
router.get("/stocklist", ensureAuthenticated, async (req, res) => {
  try {
    const items = await stockModel.find().sort({ createdAt: -1 });
    res.render("stocktable", { items, moment });
  } catch (error) {
    console.error("Error fetching items:", error.message);
    res.status(500).send("Unable to get data from the database.");
  }
});

// ================= Edit stock =================
router.get("/editstock/:id", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const item = await stockModel.findById(req.params.id);
    if (!item) return res.status(404).send("Product not found");
    res.render("editstock", { item });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
});

router.post("/editstock/:id", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const { productName, productType, totalQuantity, availableQuantity, quality, costPrice, sellingPrice, supplierName, supplierContact, date } = req.body;

    const parsedTotalQuantity = parseInt(totalQuantity);
    const parsedAvailableQuantity = parseInt(availableQuantity);

    const safeTotalQuantity = Number.isNaN(parsedTotalQuantity) ? 0 : parsedTotalQuantity;
    const safeAvailableQuantity = Number.isNaN(parsedAvailableQuantity) ? safeTotalQuantity : parsedAvailableQuantity;

    const updatedData = {
      productName,
      productType,
      totalQuantity: safeTotalQuantity,
      availableQuantity: safeAvailableQuantity,
      quality,
      costPrice: Number.isNaN(parseFloat(costPrice)) ? 0 : parseFloat(costPrice),
      sellingPrice: Number.isNaN(parseFloat(sellingPrice)) ? 0 : parseFloat(sellingPrice),
      supplierName,
      supplierContact,
      date: date || new Date()
    };

    const updated = await stockModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).send("Stock item not found");

    res.redirect("/stocklist");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating stock");
  }
});

// ================= Delete stock =================
router.post("/deletestock/:id", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const stock = await stockModel.findById(req.params.id);
    if (!stock) return res.status(404).send("Stock not found");

    await stockModel.deleteOne({ _id: req.params.id });
    res.redirect("/stocklist");
  } catch (error) {
    console.error("Error deleting stock:", error.message);
    res.status(500).send("Unable to delete item from the database.");
  }
});

module.exports = router;
