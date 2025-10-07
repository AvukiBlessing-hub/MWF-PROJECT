const express = require("express");
const router = express.Router();
const { isAuthenticated, isAttendant } = require("../middleware/auth");
const salesModel = require("../models/salesModel");
const stockModel = require("../models/stockModel");
const moment = require("moment");

// ================= Show Add Sales Page =================
router.get("/sales", isAuthenticated, isAttendant, async (req, res) => {
  try {
    const stocks = await stockModel.find().lean();
    res.render("sales", { stocks, user: req.user });
  } catch (error) {
    console.error("Error loading sales page:", error.message);
    res.redirect("/"); // redirect to landing page if error
  }
});

// ================= Handle Sales Submission =================
router.post("/sales", isAuthenticated, isAttendant, async (req, res) => {
  try {
    const { stockId, customerName, quantity, costPrice, transportCheck, paymentMethod, quality } = req.body;

    if (!stockId) return res.status(400).send("No stock selected.");

    const qty = Number(quantity);
    const price = Number(costPrice);

    const stock = await stockModel.findById(stockId);
    if (!stock) return res.status(400).send("Stock not found.");
    if (stock.availableQuantity < qty) return res.status(400).send(`Insufficient stock. Only ${stock.availableQuantity} available.`);

    const totalPrice = transportCheck ? price * qty * 1.05 : price * qty;

    const sale = new salesModel({
      productType: stock.productType,
      productName: stock.productName,
      customerName,
      Attendant: req.user._id,
      quantity: qty,
      costPrice: price,
      totalPrice,
      transportFee: !!transportCheck,
      paymentMethod,
      quality,
    });

    await sale.save();

    stock.availableQuantity -= qty;
    await stock.save();

    res.redirect("/saleslist");
  } catch (error) {
    console.error("Error processing sale:", error.message);
    res.redirect("/sales");
  }
});

// ================= Sales List =================
router.get("/saleslist", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    let sales;

    if (user.role === "Manager") {
      sales = await salesModel.find().populate("Attendant", "fullname").lean();
    } else if (user.role === "Attendant") {
      sales = await salesModel.find({ Attendant: user._id }).populate("Attendant", "fullname").lean();
    } else {
      return res.status(403).send("Access denied");
    }

    res.render("salestable", { items: sales, currentUser: user, moment });
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});

// ================= Edit Sale =================
router.post("/editsales/:id", isAuthenticated, async (req, res) => {
  try {
    const updated = await salesModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).send("Sale not found");
    res.redirect("/saleslist");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating sale");
  }
});

// ================= Delete Sale (Manager only) =================
router.post("/deletesales/:id", isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== "Manager") return res.status(403).send("Access denied");

    await salesModel.findByIdAndDelete(req.params.id);
    res.redirect("/saleslist");
  } catch (error) {
    console.error(error.message);
    res.status(400).send("Unable to delete sale");
  }
});

// ================= View Sales Receipt =================
router.get("/salesreceipt/:id", isAuthenticated, async (req, res) => {
  try {
    const sale = await salesModel.findById(req.params.id).populate("Attendant", "fullname").lean();
    if (!sale) return res.status(404).send("Sale not found");

    if (req.user.role === "Attendant" && sale.Attendant._id.toString() !== req.user._id.toString()) {
      return res.status(403).send("Access denied. You can only view your own receipts.");
    }

    res.render("receipt", { sale, moment });
  } catch (error) {
    console.error(error.message);
    res.redirect("/saleslist");
  }
});

module.exports = router;
