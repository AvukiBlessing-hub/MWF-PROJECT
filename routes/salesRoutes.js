const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureAttendant: ensureAttendant } = require("../middleware/auth"); // <-- renamed here
const UserModel = require("../models/userModel"); // add this
const salesModel = require("../models/salesModel");
const stockModel = require("../models/stockModel");
const moment = require("moment");



// ================= Show Add Sales Page =================
router.get("/sales", ensureAttendant, async (req, res) => {
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
  console.log("POST /sales received:", req.body, "User:", req.user);
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
  sales = await salesModel.find().populate("Attendant", "fullname");
} else if (currentUser.role === "Attendant") {
  sales = await salesModel.find({ Attendant: currentUser._id }).populate("Attendant", "fullname");
} else {
  return res.status(403).send("Access denied.");
}


    res.render("salestable", { items: sales, currentUser, moment });
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});
router.post("/editsales/:id", async (req, res) => {
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

    if (!updated) return res.status(404).send("Sales item not found");
    res.redirect("/saleslist");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating sales");
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
// ================= View Sales Receipt =================
router.get("/salesreceipt/:id", ensureAuthenticated, async (req, res) => {
  try {
    const sale = await salesModel
      .findById(req.params.id)
      .populate("Attendant", "fullname");

    if (!sale) return res.status(404).send("Sale not found");

    // Restrict attendants to only their own sales
    if (req.user.role === "Attendant" && sale.Attendant._id.toString() !== req.user._id.toString()) {
      return res.status(403).send("Access denied. You can only view your own receipts.");
    }

    res.render("receipt", { sale, moment });
  } catch (error) {
    console.error("Error fetching sale receipt:", error.message);
    res.redirect("/saleslist");
  }
});



module.exports = router;
