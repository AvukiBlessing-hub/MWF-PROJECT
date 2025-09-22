const express = require("express");
const router = express.Router();
const { ensureauthenticated, ensuremanager } = require("../middleware/auth");

const stockModel = require("../models/stockModel");

// Stock page
router.get("/stock", ensureauthenticated, ensuremanager, (req, res) => {
  res.render("stock", { title: "Stock Page" });
});

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

// Get stock list
router.get("/stocklist", async (req, res) => {
  try {
    let items = await stockModel.find().sort({ $natural: -1 });
    res.render("stocktable", { items });
  } catch (error) {
    console.error("Error fetching items", error.message);
    res.status(400).send("Unable to get data from the database.");
  }
});

// Dashboard
router.get("/dashboard", ensureauthenticated, ensuremanager, (req, res) => {
  res.render("dashboard", { title: "Dashboard Page" });
});

// Edit stock
router.get("/editstock/:id", async (req, res) => {
  try {
    const product = await stockModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("editstock", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
});

router.put("/editstock/:id", async (req, res) => {
  try {
    const product = await stockModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.redirect("/stocklist");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating product");
  }
});

// Delete stock
router.post("/deletestock", ensureauthenticated, async (req, res) => {
  try {
    await stockModel.deleteOne({ _id: req.body.id });
    res.redirect("back");
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Unable to delete item from the database.");
  }
});

module.exports = router;
