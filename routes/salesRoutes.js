const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureAttendant: ensureAttendant } = require("../middleware/auth"); // <-- renamed here
const salesModel = require("../models/salesModel");
const stockModel = require("../models/stockModel");
const moment = require("moment");

// ================= Show Add Sales Page =================
router.get("/sales", ensureAuthenticated, ensureAttendant, async (req, res) => {
  try {
    const stocks = await stockModel.find();
    res.render("sales", { stocks });
  } catch (error) {
    console.error("Error loading add sales page:", error.message);
    res.redirect("/");
  }
});

// ================= Handle Sales Submission =================
router.post("/sales", ensureAuthenticated, ensureAttendant, async (req, res) => {
  try {
    const { stockId, customerName, quantity, costPrice, transportCheck, paymentMethod, quality } = req.body;
    if (!stockId) return res.status(400).send("No stock selected.");

    const qty = Number(quantity);
    const price = Number(costPrice);

    const stock = await stockModel.findById(stockId);
    if (!stock) return res.status(400).send(`No stock found for ID: ${stockId}`);
    if (stock.quantity < qty) return res.status(400).send(`Insufficient stock. Only ${stock.quantity} available.`);

    let total = price * qty;
    if (transportCheck) total *= 1.05;

    const sale = new salesModel({
      productType: stock.productType,
      productName: stock.productName,
      customerName,
      Attendant: req.user._id,
      quantity: qty,
      costPrice: price,
      totalPrice: total,
      transportFee: !!transportCheck,
      paymentMethod,
      quality,
    });

    await sale.save();
    stock.quantity -= qty;
    await stock.save();

    res.redirect("/saleslist");
  } catch (error) {
    console.error("Error processing sale:", error.message);
    res.redirect("/sales");
  }
});

// ================= Sales List (for agents and managers) =================
router.get("/saleslist", ensureAuthenticated, async (req, res) => {
  try {
    const currentUser = req.user;

    let sales;
    if (currentUser.role === "Manager") {
      sales = await salesModel.find().populate("Attendant", "name");
    } else if (currentUser.role === "Attendant") {
      sales = await salesModel.find({ Attendant: currentUser._id }).populate("Attendant", "name");
    } else {
      return res.status(403).send("Access denied.");
    }

    res.render("salestable", { items: sales, currentUser, moment });
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});

// ================= Delete Sale =================
router.post("/deletesales/:id", ensureAuthenticated, async (req, res) => {
  try {
    const currentUser = req.user;
    if (currentUser.role !== "Manager") return res.status(403).send("Access denied.");

    await salesModel.findByIdAndDelete(req.params.id);
    res.redirect("/saleslist");
  } catch (error) {
    console.error(error.message);
    res.status(400).send("Unable to delete sale.");
  }
});

module.exports = router;
