const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureManager } = require("../middleware/auth"); // <-- fix capitalization
const moment = require("moment");

const stockModel = require("../models/stockModel");

// ================= Stock page =================
router.get("/stock", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("stock", { title: "Stock Page" });
});

// ================= Add Stock =================
router.post("/stock", async (req, res) => {
  try {
    const stock = new stockModel(req.body);
    console.log(req.body);
    await stock.save();
    res.redirect("/stocklist");
  } catch (error) {
    console.error(error);
    res.redirect("/stock");
  }
});

// ================= Get stock list =================
router.get("/stocklist", async (req, res) => {
  try {
    let items = await stockModel.find().sort({ $natural: -1 });
    res.render("stocktable", { items, moment });
  } catch (error) {
    console.error("Error fetching items", error.message);
    res.status(400).send("Unable to get data from the database.");
  }
});

// ================= Dashboard =================
router.get("/dashboard", ensureAuthenticated, ensureManager, (req, res) => {
  res.render("dashboard", { title: "Dashboard Page" });
});

// ================= Edit stock =================
router.get("/editstock/:id", async (req, res) => {
  try {
    const item = await stockModel.findById(req.params.id);
    if (!item) return res.status(404).send("Product not found");
    res.render("editstock", { item });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
});

router.post("/editstock/:id", async (req, res) => {
  try {
    const updated = await stockModel.findByIdAndUpdate(
      req.params.id,
      {
        productName: req.body.productName,
        productType: req.body.productType,
        quantity: req.body.quantity,
        quality: req.body.quality,
        costPrice: req.body.costPrice,
        sellingPrice: req.body.sellingPrice,
        supplierName: req.body.supplierName,
        date: req.body.date,
      },
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
router.post("/deletestock/:id", ensureAuthenticated, async (req, res) => {
  try {
    await stockModel.deleteOne({ _id: req.params.id });
    res.redirect("/stocklist");
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Unable to delete item from the database.");
  }
});

module.exports = router;
